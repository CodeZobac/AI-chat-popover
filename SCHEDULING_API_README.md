# Scheduling API Implementation

This document describes the implementation of the scheduling system for the ETIC AI Chatbot, covering database integration, email notifications, and reference number generation.

## Overview

The scheduling system supports three types of scheduling requests:
- **Interview Scheduling**: For prospective students to schedule interviews
- **Tour Scheduling**: For campus tours with group size and special requirements
- **Call Scheduling**: For phone consultations with availability checking

## API Endpoints

### Interview Scheduling
- **POST** `/api/scheduling/interview`
- Creates interview scheduling requests with program interest and format preferences
- Generates unique reference numbers and sends confirmation emails

### Tour Scheduling  
- **POST** `/api/scheduling/tour`
- Creates tour scheduling requests with group size and special requirements
- Includes availability checking and confirmation system

### Call Scheduling
- **POST** `/api/scheduling/call`
- **GET** `/api/scheduling/call?date=YYYY-MM-DD&timezone=Europe/Lisbon`
- Creates call scheduling requests with availability checking
- GET endpoint returns available time slots for a specific date

## Database Schema

The system uses PostgreSQL with Prisma ORM. Key models:

### UserSession
- Tracks user sessions with IP address and user agent
- Links to messages and scheduling requests

### SchedulingRequest
- Stores all scheduling requests with type-specific fields
- Includes contact information, preferences, and metadata
- Supports interview, tour, and call specific fields

### Message
- Stores chat conversation history
- Links to user sessions for context

## Features Implemented

### ✅ Database Integration
- Proper session management with user tracking
- Comprehensive data storage for all scheduling types
- Relationship management between sessions, messages, and requests

### ✅ Reference Number Generation
- Unique reference numbers for each request type
- Format: `{TYPE}-{ID}-{TIMESTAMP}` (e.g., `INT-A1B2C3D4-1234`)
- Validation and type extraction utilities

### ✅ Email Notifications
- User confirmation emails with request details
- Admin notification emails for follow-up
- HTML and text email templates
- Non-blocking email sending to prevent API delays

### ✅ Session Management
- Automatic session creation and tracking
- Session validation and cleanup utilities
- IP address and user agent tracking for security

### ✅ Error Handling
- Comprehensive validation using Zod schemas
- Proper HTTP status codes and error messages
- Database constraint handling
- Graceful degradation when services are unavailable

### ✅ Availability Checking
- Real-time availability checking for call scheduling
- Prevents double-booking of time slots
- Database-driven availability (not mocked data)

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Email Service (Resend)
RESEND_API_KEY="your_resend_api_key_here"
FROM_EMAIL="ETIC AI <noreply@your-domain.com>"
ADMIN_EMAIL="admissions@your-domain.com"

# AI Service (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key_here"
```

## Database Migration

To apply the database schema changes:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (when database is available)
npx prisma migrate dev --name add-scheduling-fields

# Or create migration file only
npx prisma migrate dev --create-only --name add-scheduling-fields
```

## Testing

Use the provided test script to verify API functionality:

```bash
# Start the Next.js development server
npm run dev

# In another terminal, run the test script
node test-scheduling-api.js
```

The test script will:
- Test all three scheduling endpoints
- Verify data validation
- Check reference number generation
- Test availability checking
- Simulate real user interactions

## Email Templates

The system includes comprehensive email templates:

### User Confirmation Emails
- Professional HTML and text versions
- Include all request details and reference numbers
- Clear next steps and contact information
- Branded with ETIC Algarve styling

### Admin Notification Emails
- Detailed request information for follow-up
- Contact details with clickable links
- Action required notifications
- Reference numbers for tracking

## Security Features

- Session-based request tracking
- Input validation and sanitization
- Rate limiting protection (via Next.js)
- CORS configuration
- SQL injection prevention (via Prisma)
- XSS protection through proper data handling

## Performance Optimizations

- Non-blocking email sending
- Database query optimization
- Proper indexing on frequently queried fields
- Connection pooling via Prisma
- Graceful error handling to prevent cascading failures

## Integration Points

The scheduling system integrates with:
- **Chat System**: Session management links chat conversations to scheduling requests
- **Email Service**: Resend API for reliable email delivery
- **Database**: PostgreSQL with Prisma ORM for data persistence
- **Frontend Forms**: React Hook Form with Zod validation
- **AI Chatbot**: Action buttons trigger scheduling flows

## Next Steps

Future enhancements could include:
- Calendar integration (Google Calendar, Outlook)
- SMS notifications via Twilio
- Real-time availability updates
- Automated reminder systems
- Admin dashboard for managing requests
- Webhook integrations for CRM systems

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check network connectivity

2. **Email Not Sending**
   - Verify RESEND_API_KEY is valid
   - Check FROM_EMAIL domain is verified in Resend
   - Ensure ADMIN_EMAIL is configured

3. **Validation Errors**
   - Check request data matches Zod schemas
   - Verify date formats are correct
   - Ensure required fields are provided

4. **Session Issues**
   - Check x-session-id header is being sent
   - Verify session management utilities are working
   - Check database session table

## API Response Examples

### Successful Interview Scheduling
```json
{
  "success": true,
  "message": "Interview scheduled successfully! You will receive a confirmation email shortly.",
  "data": {
    "referenceNumber": "INT-A1B2C3D4-1234",
    "schedulingRequest": {
      "id": "clx1234567890",
      "type": "interview",
      "status": "pending",
      "preferredDate": "2025-01-27T00:00:00.000Z",
      "timePreference": "morning",
      "format": "video",
      "programInterest": "Web Development",
      "createdAt": "2025-01-20T10:30:00.000Z"
    }
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Name is required"
    }
  ]
}
```

This implementation provides a robust, scalable scheduling system that meets all the requirements specified in task 7.2.