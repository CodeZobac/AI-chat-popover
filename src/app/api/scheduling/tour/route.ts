import { NextRequest, NextResponse } from "next/server";
import { tourSchedulingSchema } from "@/types/validation";
import { PrismaClient } from "@prisma/client";
import { extractSessionInfo, ensureUserSession } from "@/lib/session";
import { generateReferenceNumber } from "@/lib/reference-generator";
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = tourSchedulingSchema.safeParse(body);
    
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

    // Create the scheduling request in the database
    const schedulingRequest = await prisma.schedulingRequest.create({
      data: {
        sessionId: sessionInfo.sessionId,
        type: "tour",
        status: "pending",
        contactName: data.name,
        contactEmail: data.email,
        contactPhone: data.phone || null,
        preferredDate: data.preferredDate,
        timePreference: data.timePreference,
        specificTime: data.specificTime || null,
        notes: data.notes || null,
        groupSize: data.groupSize || null,
        specialRequirements: data.specialRequirements || null,
      },
    });

    // Generate a reference number for the user
    const referenceNumber = generateReferenceNumber('tour', schedulingRequest.id);

    // Prepare email notification data
    const emailData = {
      type: 'tour' as const,
      referenceNumber,
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      preferredDate: data.preferredDate,
      timePreference: data.timePreference,
      specificTime: data.specificTime,
      notes: data.notes,
      groupSize: data.groupSize,
      specialRequirements: data.specialRequirements,
    };

    // Send confirmation email to user (non-blocking)
    sendUserConfirmationEmail(emailData).catch(error => {
      console.error('Failed to send user confirmation email:', error);
    });

    // Send notification email to admin (non-blocking)
    sendAdminNotificationEmail(emailData).catch(error => {
      console.error('Failed to send admin notification email:', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tour scheduled successfully! You will receive a confirmation email shortly.",
        data: {
          referenceNumber,
          schedulingRequest: {
            id: schedulingRequest.id,
            type: schedulingRequest.type,
            status: schedulingRequest.status,
            preferredDate: schedulingRequest.preferredDate,
            timePreference: schedulingRequest.timePreference,
            createdAt: schedulingRequest.createdAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error scheduling tour:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Duplicate request",
            message: "A tour with these details already exists. Please check your email for confirmation details." 
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: "Failed to schedule your tour. Please try again later." 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    
    if (!date) {
      return NextResponse.json(
        { message: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date
    const requestedDate = new Date(date);
    
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Get existing bookings for the date
    const existingBookings = await prisma.schedulingRequest.findMany({
      where: {
        type: "tour",
        status: {
          in: ["pending", "confirmed"],
        },
        preferredDate: requestedDate,
      },
      select: {
        specificTime: true,
      },
    });

    // Calculate available time slots
    const bookedSlots = existingBookings
      .filter(booking => booking.specificTime)
      .map(booking => booking.specificTime as string);

    const availableSlots = [
      "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
    ].filter(slot => !bookedSlots.includes(slot));

    return NextResponse.json({
      date: requestedDate.toISOString(),
      availableSlots,
      bookedSlots,
      totalBookings: existingBookings.length,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}