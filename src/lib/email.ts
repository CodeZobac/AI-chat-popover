import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailNotificationData {
  type: 'interview' | 'tour' | 'call';
  referenceNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredDate?: Date;
  timePreference?: string;
  specificTime?: string;
  format?: string;
  programInterest?: string;
  notes?: string;
  groupSize?: number;
  specialRequirements?: string;
  callPurpose?: string;
  timezone?: string;
}

export async function sendUserConfirmationEmail(data: EmailNotificationData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const subject = getEmailSubject(data.type, data.referenceNumber);
    const htmlContent = generateUserConfirmationHTML(data);
    const textContent = generateUserConfirmationText(data);

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'ETIC AI <noreply@etic-algarve.com>',
      to: [data.contactEmail],
      subject,
      html: htmlContent,
      text: textContent,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send user confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendAdminNotificationEmail(data: EmailNotificationData) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    console.warn('Email configuration missing, skipping admin notification');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const subject = `New ${data.type} request - ${data.referenceNumber}`;
    const htmlContent = generateAdminNotificationHTML(data);
    const textContent = generateAdminNotificationText(data);

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'ETIC AI <noreply@etic-algarve.com>',
      to: [process.env.ADMIN_EMAIL],
      subject,
      html: htmlContent,
      text: textContent,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function getEmailSubject(type: string, referenceNumber: string): string {
  switch (type) {
    case 'interview':
      return `Interview Request Confirmation - ${referenceNumber}`;
    case 'tour':
      return `Campus Tour Booking Confirmation - ${referenceNumber}`;
    case 'call':
      return `Call Scheduling Confirmation - ${referenceNumber}`;
    default:
      return `Scheduling Confirmation - ${referenceNumber}`;
  }
}

function generateUserConfirmationHTML(data: EmailNotificationData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeDisplay = () => {
    if (data.specificTime) {
      return data.specificTime;
    }
    return data.timePreference === 'morning' ? 'Morning' : 'Afternoon';
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation - ${data.referenceNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2563eb; margin: 0;">ETIC Algarve</h1>
        <p style="margin: 5px 0 0 0; color: #6b7280;">Your ${data.type} request has been received</p>
      </div>
      
      <h2>Hello ${data.contactName},</h2>
      
      <p>Thank you for your interest in ETIC Algarve! We have received your ${data.type} request and will get back to you soon.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Request Details</h3>
        <p><strong>Reference Number:</strong> ${data.referenceNumber}</p>
        <p><strong>Type:</strong> ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
        ${data.preferredDate ? `<p><strong>Preferred Date:</strong> ${formatDate(data.preferredDate)}</p>` : ''}
        ${data.timePreference ? `<p><strong>Time:</strong> ${getTimeDisplay()}</p>` : ''}
        ${data.format ? `<p><strong>Format:</strong> ${data.format}</p>` : ''}
        ${data.programInterest ? `<p><strong>Program Interest:</strong> ${data.programInterest}</p>` : ''}
        ${data.callPurpose ? `<p><strong>Call Purpose:</strong> ${data.callPurpose}</p>` : ''}
        ${data.groupSize ? `<p><strong>Group Size:</strong> ${data.groupSize}</p>` : ''}
      </div>
      
      <h3>What happens next?</h3>
      <ul>
        <li>Our admissions team will review your request within 24 hours</li>
        <li>We'll contact you via email or phone to confirm the details</li>
        <li>You'll receive a calendar invitation once confirmed</li>
      </ul>
      
      <p>If you have any questions or need to make changes, please contact us at <a href="mailto:admissions@etic-algarve.com">admissions@etic-algarve.com</a> and reference your confirmation number: <strong>${data.referenceNumber}</strong></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>Best regards,<br>ETIC Algarve Admissions Team</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}

function generateUserConfirmationText(data: EmailNotificationData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeDisplay = () => {
    if (data.specificTime) {
      return data.specificTime;
    }
    return data.timePreference === 'morning' ? 'Morning' : 'Afternoon';
  };

  return `
ETIC Algarve - ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Request Confirmation

Hello ${data.contactName},

Thank you for your interest in ETIC Algarve! We have received your ${data.type} request and will get back to you soon.

REQUEST DETAILS:
Reference Number: ${data.referenceNumber}
Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}
${data.preferredDate ? `Preferred Date: ${formatDate(data.preferredDate)}` : ''}
${data.timePreference ? `Time: ${getTimeDisplay()}` : ''}
${data.format ? `Format: ${data.format}` : ''}
${data.programInterest ? `Program Interest: ${data.programInterest}` : ''}
${data.callPurpose ? `Call Purpose: ${data.callPurpose}` : ''}
${data.groupSize ? `Group Size: ${data.groupSize}` : ''}

WHAT HAPPENS NEXT:
- Our admissions team will review your request within 24 hours
- We'll contact you via email or phone to confirm the details
- You'll receive a calendar invitation once confirmed

If you have any questions or need to make changes, please contact us at admissions@etic-algarve.com and reference your confirmation number: ${data.referenceNumber}

Best regards,
ETIC Algarve Admissions Team

This is an automated message. Please do not reply to this email.
  `.trim();
}

function generateAdminNotificationHTML(data: EmailNotificationData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New ${data.type} Request - ${data.referenceNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
        <h1 style="color: #92400e; margin: 0;">New ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Request</h1>
        <p style="margin: 5px 0 0 0; color: #78350f;">Reference: ${data.referenceNumber}</p>
      </div>
      
      <h2>Contact Information</h2>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p><strong>Name:</strong> ${data.contactName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></p>
        ${data.contactPhone ? `<p><strong>Phone:</strong> <a href="tel:${data.contactPhone}">${data.contactPhone}</a></p>` : ''}
      </div>
      
      <h2>Request Details</h2>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p><strong>Type:</strong> ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
        ${data.preferredDate ? `<p><strong>Preferred Date:</strong> ${formatDate(data.preferredDate)}</p>` : ''}
        ${data.timePreference ? `<p><strong>Time Preference:</strong> ${data.timePreference}</p>` : ''}
        ${data.specificTime ? `<p><strong>Specific Time:</strong> ${data.specificTime}</p>` : ''}
        ${data.format ? `<p><strong>Format:</strong> ${data.format}</p>` : ''}
        ${data.programInterest ? `<p><strong>Program Interest:</strong> ${data.programInterest}</p>` : ''}
        ${data.callPurpose ? `<p><strong>Call Purpose:</strong> ${data.callPurpose}</p>` : ''}
        ${data.groupSize ? `<p><strong>Group Size:</strong> ${data.groupSize}</p>` : ''}
        ${data.specialRequirements ? `<p><strong>Special Requirements:</strong> ${data.specialRequirements}</p>` : ''}
        ${data.timezone ? `<p><strong>Timezone:</strong> ${data.timezone}</p>` : ''}
      </div>
      
      ${data.notes ? `
      <h2>Additional Notes</h2>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p>${data.notes}</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 30px; padding: 20px; background-color: #dbeafe; border-radius: 6px;">
        <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
        <p>Please review this request and contact the prospective student within 24 hours to confirm the scheduling details.</p>
        <p><strong>Reference Number:</strong> ${data.referenceNumber}</p>
      </div>
    </body>
    </html>
  `;
}

function generateAdminNotificationText(data: EmailNotificationData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
NEW ${data.type.toUpperCase()} REQUEST - ${data.referenceNumber}

CONTACT INFORMATION:
Name: ${data.contactName}
Email: ${data.contactEmail}
${data.contactPhone ? `Phone: ${data.contactPhone}` : ''}

REQUEST DETAILS:
Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}
${data.preferredDate ? `Preferred Date: ${formatDate(data.preferredDate)}` : ''}
${data.timePreference ? `Time Preference: ${data.timePreference}` : ''}
${data.specificTime ? `Specific Time: ${data.specificTime}` : ''}
${data.format ? `Format: ${data.format}` : ''}
${data.programInterest ? `Program Interest: ${data.programInterest}` : ''}
${data.callPurpose ? `Call Purpose: ${data.callPurpose}` : ''}
${data.groupSize ? `Group Size: ${data.groupSize}` : ''}
${data.specialRequirements ? `Special Requirements: ${data.specialRequirements}` : ''}
${data.timezone ? `Timezone: ${data.timezone}` : ''}

${data.notes ? `ADDITIONAL NOTES:\n${data.notes}\n` : ''}

ACTION REQUIRED:
Please review this request and contact the prospective student within 24 hours to confirm the scheduling details.

Reference Number: ${data.referenceNumber}
  `.trim();
}