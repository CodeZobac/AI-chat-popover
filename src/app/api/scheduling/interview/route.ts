import { NextRequest, NextResponse } from "next/server";
import { interviewSchedulingSchema } from "@/types/validation";
import { PrismaClient } from "@prisma/client";
import { extractSessionInfo, ensureUserSession } from "@/lib/session";
import { generateReferenceNumber } from "@/lib/reference-generator";
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = interviewSchedulingSchema.safeParse(body);
    
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

    // Store the scheduling request in the database
    const schedulingRequest = await prisma.schedulingRequest.create({
      data: {
        sessionId: sessionInfo.sessionId,
        type: "interview",
        status: "pending",
        contactName: data.name,
        contactEmail: data.email,
        contactPhone: data.phone || null,
        preferredDate: data.preferredDate,
        timePreference: data.timePreference,
        specificTime: data.specificTime || null,
        format: data.format,
        programInterest: data.programInterest,
        notes: data.notes || null,
      },
    });

    // Generate a reference number for the user
    const referenceNumber = generateReferenceNumber('interview', schedulingRequest.id);

    // Prepare email notification data
    const emailData = {
      type: 'interview' as const,
      referenceNumber,
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      preferredDate: data.preferredDate,
      timePreference: data.timePreference,
      specificTime: data.specificTime,
      format: data.format,
      programInterest: data.programInterest,
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

    return NextResponse.json({
      success: true,
      message: "Interview scheduled successfully! You will receive a confirmation email shortly.",
      data: {
        referenceNumber,
        schedulingRequest: {
          id: schedulingRequest.id,
          type: schedulingRequest.type,
          status: schedulingRequest.status,
          preferredDate: schedulingRequest.preferredDate,
          timePreference: schedulingRequest.timePreference,
          format: schedulingRequest.format,
          programInterest: schedulingRequest.programInterest,
          createdAt: schedulingRequest.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error processing interview scheduling request:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            success: false,
            error: "Duplicate request",
            message: "A similar interview request already exists. Please check your email for confirmation details.",
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to process your interview scheduling request. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}