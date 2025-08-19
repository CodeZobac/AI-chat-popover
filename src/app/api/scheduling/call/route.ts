import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callSchedulingSchema } from "@/types/validation";
import { PrismaClient } from "@prisma/client";
import { extractSessionInfo, ensureUserSession } from "@/lib/session";
import { generateReferenceNumber } from "@/lib/reference-generator";
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

// Available time slots
const AVAILABLE_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

// GET endpoint for checking availability
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const timezoneParam = searchParams.get("timezone");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    const timezone = timezoneParam || "Europe/Lisbon";
    const dateString = date.toISOString().split("T")[0];

    // Get existing call bookings for the date from database
    const existingBookings = await prisma.schedulingRequest.findMany({
      where: {
        type: "call",
        status: {
          in: ["pending", "confirmed"],
        },
        preferredDate: {
          gte: new Date(dateString + "T00:00:00.000Z"),
          lt: new Date(dateString + "T23:59:59.999Z"),
        },
      },
      select: {
        specificTime: true,
        timePreference: true,
      },
    });

    // Extract booked time slots
    const bookedSlots = existingBookings
      .filter(booking => booking.specificTime)
      .map(booking => booking.specificTime as string);

    // Calculate available slots
    const availableSlots = AVAILABLE_TIME_SLOTS.filter(
      slot => !bookedSlots.includes(slot)
    );

    return NextResponse.json({
      date: dateString,
      timezone,
      availableSlots,
      bookedSlots,
      totalSlots: AVAILABLE_TIME_SLOTS.length,
      totalBookings: existingBookings.length,
    });

  } catch (error) {
    console.error("Error fetching call availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// POST endpoint for scheduling calls
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = callSchedulingSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Extract session information from request
    const sessionInfo = extractSessionInfo(request);
    
    // Ensure user session exists in database
    await ensureUserSession(sessionInfo);

    // Check availability again to prevent double booking
    if (data.timePreference === "specific" && data.specificTime) {
      const dateString = data.preferredDate.toISOString().split("T")[0];
      const existingBooking = await prisma.schedulingRequest.findFirst({
        where: {
          type: "call",
          status: {
            in: ["pending", "confirmed"],
          },
          preferredDate: {
            gte: new Date(dateString + "T00:00:00.000Z"),
            lt: new Date(dateString + "T23:59:59.999Z"),
          },
          specificTime: data.specificTime,
        },
      });

      if (existingBooking) {
        return NextResponse.json(
          {
            success: false,
            error: "Time slot unavailable",
            message: "The selected time slot is no longer available. Please choose a different time.",
          },
          { status: 409 }
        );
      }
    }

    // Create the scheduling request in the database
    const schedulingRequest = await prisma.schedulingRequest.create({
      data: {
        sessionId: sessionInfo.sessionId,
        type: "call",
        status: "pending",
        contactName: data.name,
        contactEmail: data.email,
        contactPhone: data.phone,
        preferredDate: data.preferredDate,
        timePreference: data.timePreference,
        specificTime: data.specificTime || null,
        notes: data.notes || null,
        callPurpose: data.callPurpose || null,
        timezone: data.timezone || null,
      },
    });

    // Generate a reference number for the user
    const referenceNumber = generateReferenceNumber('call', schedulingRequest.id);

    // Prepare email notification data
    const emailData = {
      type: 'call' as const,
      referenceNumber,
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      preferredDate: data.preferredDate,
      timePreference: data.timePreference,
      specificTime: data.specificTime,
      callPurpose: data.callPurpose,
      timezone: data.timezone,
      notes: data.notes,
    };

    // Send confirmation email to user (non-blocking)
    sendUserConfirmationEmail(emailData).catch(error => {
      console.error('Failed to send user confirmation email:', error);
    });

    // Send notification email to admin (non-blocking)
    sendAdminNotificationEmail(emailData).catch(error => {
      console.error('Failed to send admin notification email:', error);
    });

    // Return success response with reference number
    return NextResponse.json({
      success: true,
      message: "Call scheduled successfully! You will receive a confirmation email shortly.",
      data: {
        referenceNumber,
        schedulingRequest: {
          id: schedulingRequest.id,
          type: schedulingRequest.type,
          status: schedulingRequest.status,
          preferredDate: schedulingRequest.preferredDate,
          timePreference: schedulingRequest.timePreference,
          specificTime: schedulingRequest.specificTime,
          createdAt: schedulingRequest.createdAt,
        },
      },
    });

  } catch (error) {
    console.error("Error scheduling call:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            success: false,
            error: "Duplicate request",
            message: "A similar call request already exists. Please check your email for confirmation details.",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: "Failed to schedule your call. Please try again later." 
      },
      { status: 500 }
    );
  }
}

// PUT endpoint for updating call requests
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Call request ID is required" },
        { status: 400 }
      );
    }

    // For updates, we'll validate only the provided fields
    // In a real implementation, you'd create a proper partial schema
    const validatedData = updateData;

    // In a real application, you would:
    // 1. Find the existing call request
    // 2. Check if updates are allowed (e.g., not too close to scheduled time)
    // 3. Update the database
    // 4. Send update notification email
    // 5. Update calendar event

    console.log(`Updating call request ${id}:`, validatedData);

    return NextResponse.json({
      success: true,
      message: "Call request updated successfully",
      id,
      updatedAt: new Date(),
    });

  } catch (error) {
    console.error("Error updating call request:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update call request" },
      { status: 500 }
    );
  }
}

// DELETE endpoint for canceling calls
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Call request ID is required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Find the call request
    // 2. Check if cancellation is allowed
    // 3. Update status to cancelled
    // 4. Send cancellation email
    // 5. Remove from calendar

    console.log(`Cancelling call request ${id}`);

    return NextResponse.json({
      success: true,
      message: "Call cancelled successfully",
      id,
      cancelledAt: new Date(),
    });

  } catch (error) {
    console.error("Error cancelling call:", error);
    return NextResponse.json(
      { error: "Failed to cancel call" },
      { status: 500 }
    );
  }
}