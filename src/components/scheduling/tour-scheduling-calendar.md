# Tour Scheduling Calendar

A comprehensive React component for scheduling campus tours at ETIC Algarve, built with ShadCN UI components and integrated with real-time availability checking.

## Features

### Core Functionality
- **Date Selection**: Interactive calendar with availability checking
- **Time Slot Management**: Real-time availability for specific time slots
- **Group Size Selection**: Support for individual and group tours (1-20 people)
- **Contact Information**: Full contact details collection with validation
- **Special Requirements**: Accessibility and special needs accommodation
- **Form Validation**: Comprehensive validation using Zod schemas

### User Experience
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Real-time Feedback**: Instant validation and availability updates
- **Loading States**: Clear feedback during form submission and data loading
- **Accessibility**: Full keyboard navigation and screen reader support

### Technical Features
- **API Integration**: Real-time availability checking via REST API
- **Database Storage**: Persistent storage of tour requests
- **TypeScript**: Full type safety with Zod validation schemas
- **Error Handling**: Graceful error handling and user feedback

## Components

### TourSchedulingCalendar
Main component for tour scheduling with full functionality.

```tsx
import { TourSchedulingCalendar } from "@/components/scheduling";

<TourSchedulingCalendar
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={false}
  initialData={initialData}
/>
```

### TourSchedulingDemo
Demo component with simulated API calls for testing.

```tsx
import { TourSchedulingDemo } from "@/components/scheduling";

<TourSchedulingDemo />
```

### TourSchedulingCalendarWithApi
Production-ready component with real API integration.

```tsx
import { TourSchedulingCalendarWithApi } from "@/components/scheduling";

<TourSchedulingCalendarWithApi
  onSuccess={handleSuccess}
  onError={handleError}
  onCancel={handleCancel}
/>
```

## API Integration

### POST /api/scheduling/tour
Creates a new tour scheduling request.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+351123456789",
  "preferredDate": "2024-12-25T00:00:00.000Z",
  "timePreference": "specific",
  "specificTime": "10:00",
  "groupSize": 3,
  "specialRequirements": "Wheelchair accessible",
  "notes": "Looking forward to learning about the programs"
}
```

**Response:**
```json
{
  "message": "Tour scheduled successfully",
  "referenceNumber": "TOUR-123456",
  "schedulingRequest": {
    "id": "clx...",
    "type": "tour",
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### GET /api/scheduling/tour?date=2024-12-25
Checks availability for a specific date.

**Response:**
```json
{
  "date": "2024-12-25T00:00:00.000Z",
  "availableSlots": ["09:00", "10:00", "11:00", "15:00", "16:00"],
  "bookedSlots": ["14:00"],
  "totalBookings": 1
}
```

## Form Schema

The component uses a comprehensive Zod schema for validation:

```typescript
export const tourSchedulingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredDate: z.date().refine(date => date > new Date()),
  timePreference: z.enum(["morning", "afternoon", "specific"]),
  specificTime: z.string().optional(),
  groupSize: z.number().min(1).max(20).default(1),
  specialRequirements: z.string().max(300).optional(),
  notes: z.string().max(500).optional(),
});
```

## Availability Logic

### Business Rules
- Tours available Monday through Friday only
- Available time slots: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM
- Bookings accepted up to 2 months in advance
- Real-time conflict checking for specific time slots

### Time Preferences
- **Morning**: 9:00 AM - 12:00 PM (flexible scheduling)
- **Afternoon**: 2:00 PM - 5:00 PM (flexible scheduling)
- **Specific**: Choose exact time slot with availability checking

## Database Schema

Tours are stored in the `scheduling_requests` table:

```sql
CREATE TABLE scheduling_requests (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'tour'
  status TEXT DEFAULT 'pending',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_date TIMESTAMP,
  time_preference TEXT,
  specific_time TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

The component includes comprehensive tests covering:
- Form rendering and validation
- User interactions and form submission
- API integration and error handling
- Accessibility and keyboard navigation

Run tests with:
```bash
npm test tour-scheduling-calendar
```

## Usage Examples

### Basic Usage
```tsx
function TourBookingPage() {
  const handleSubmit = async (data: TourSchedulingFormData) => {
    // Handle form submission
    console.log('Tour scheduled:', data);
  };

  return (
    <TourSchedulingCalendar
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
```

### With Initial Data
```tsx
function EditTourBooking({ existingBooking }: { existingBooking: TourBooking }) {
  return (
    <TourSchedulingCalendar
      onSubmit={handleUpdate}
      initialData={{
        name: existingBooking.contactName,
        email: existingBooking.contactEmail,
        preferredDate: existingBooking.preferredDate,
        groupSize: existingBooking.groupSize,
      }}
    />
  );
}
```

### Integration with Chat
```tsx
function ChatTourScheduling({ chatContext }: { chatContext: ChatContext }) {
  return (
    <TourSchedulingCalendarWithApi
      onSuccess={(data) => {
        // Send confirmation message to chat
        chatContext.addMessage({
          role: 'assistant',
          content: `Great! Your tour has been scheduled for ${format(data.preferredDate, 'PPP')}. Reference: ${data.referenceNumber}`
        });
      }}
      initialData={{
        name: chatContext.userInfo?.name,
        email: chatContext.userInfo?.email,
      }}
    />
  );
}
```

## Customization

### Styling
The component uses ShadCN UI components and can be customized through:
- CSS variables for colors and spacing
- Tailwind classes for layout modifications
- Component prop overrides for behavior changes

### Time Slots
Modify available time slots by updating the `TIME_SLOTS` constant:

```typescript
const TIME_SLOTS = [
  { value: "08:00", label: "8:00 AM", available: true },
  { value: "09:00", label: "9:00 AM", available: true },
  // Add more slots as needed
];
```

### Group Size Options
Customize group size options by modifying `GROUP_SIZE_OPTIONS`:

```typescript
const GROUP_SIZE_OPTIONS = [
  { value: 1, label: "Individual" },
  { value: 5, label: "Small group (2-5)" },
  { value: 15, label: "Large group (6-15)" },
];
```

## Performance Considerations

- **Lazy Loading**: Time slot availability is fetched only when needed
- **Debounced API Calls**: Prevents excessive API requests during date selection
- **Optimistic Updates**: UI updates immediately while API calls process in background
- **Error Boundaries**: Graceful handling of component failures

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus flow through form elements
- **High Contrast**: Compatible with high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Future Enhancements

- **Calendar Integration**: Sync with Google Calendar/Outlook
- **Email Notifications**: Automated confirmation and reminder emails
- **SMS Notifications**: Text message confirmations and reminders
- **Multi-language Support**: Internationalization for Portuguese/English
- **Advanced Availability**: Integration with staff schedules and room bookings
- **Recurring Tours**: Support for regular tour schedules
- **Waitlist Management**: Queue system for fully booked dates