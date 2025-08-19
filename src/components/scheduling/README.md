# Scheduling Components

This directory contains the scheduling form implementations for the ETIC AI Chatbot system, including interview scheduling and tour scheduling components.

## Components

### Interview Scheduling

#### `InterviewSchedulingForm`

The main form component that handles interview scheduling with comprehensive validation and user experience features.

**Features:**
- Complete form validation using Zod schema
- Responsive design with ShadCN UI components
- Date picker with calendar widget
- Dynamic time preference selection
- Program selection from ETIC Algarve offerings
- Interview format selection (video, in-person, phone)
- Loading states and error handling
- Accessibility compliance

**Props:**
```typescript
interface InterviewSchedulingFormProps {
  onSubmit: (data: InterviewSchedulingFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<InterviewSchedulingFormData>;
}
```

#### `InterviewSchedulingFormWithApi`

A wrapper component that handles API integration and provides success/error states.

**Features:**
- Automatic API calls to `/api/scheduling/interview`
- Success state with reference number display
- Error handling with retry functionality
- Loading states during submission

**Props:**
```typescript
interface InterviewSchedulingFormWithApiProps {
  onSuccess?: (referenceNumber: string) => void;
  onCancel?: () => void;
  initialData?: Partial<InterviewSchedulingFormData>;
}
```

#### `InterviewSchedulingDemo`

A demo component for testing and showcasing the form functionality.

### Tour Scheduling

#### `TourSchedulingCalendar`

The main tour scheduling component with comprehensive calendar integration and real-time availability checking.

**Features:**
- Interactive calendar with date availability checking
- Real-time time slot availability via API
- Group size selection (1-20 people)
- Special requirements and accessibility needs
- Comprehensive form validation using Zod schema
- Responsive design with ShadCN UI components
- Loading states and error handling
- Accessibility compliance

**Props:**
```typescript
interface TourSchedulingCalendarProps {
  onSubmit: (data: TourSchedulingFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<TourSchedulingFormData>;
}
```

#### `TourSchedulingCalendarWithApi`

A wrapper component that handles API integration for tour scheduling.

**Features:**
- Automatic API calls to `/api/scheduling/tour`
- Real-time availability checking
- Success state with reference number display
- Error handling with retry functionality
- Loading states during submission

#### `TourSchedulingDemo`

A demo component for testing and showcasing the tour scheduling functionality.

## Form Fields

### Contact Information
- **Full Name** (required): Text input with minimum 2 characters
- **Email Address** (required): Email validation
- **Phone Number** (optional): International format support

### Program Interest
- **Program Selection** (required): Dropdown with all ETIC Algarve programs:
  - Technology & Programming: Web Development, Mobile App Development, Software Engineering, Cybersecurity
  - Digital Design: Graphic Design, UI/UX Design, Motion Graphics, Digital Illustration
  - Digital Media: Video Production, Audio Engineering, Digital Marketing, Social Media Management
  - Gaming: Game Development, Game Design, 3D Modeling and Animation
  - Business Technology: Digital Entrepreneurship, E-commerce, Project Management

### Interview Format
- **Format Selection** (required): Radio buttons for:
  - Video Call (Recommended)
  - In-Person at Campus
  - Phone Call

### Preferred Schedule
- **Preferred Date** (required): Calendar picker with future date validation
- **Time Preference** (required): Radio buttons for:
  - Morning (9:00 AM - 12:00 PM)
  - Afternoon (1:00 PM - 5:00 PM)
  - Specific Time (shows additional time input field)
- **Specific Time** (conditional): Text input for custom time specification

### Additional Information
- **Notes** (optional): Textarea for additional questions or topics (max 500 characters)

## Validation Schema

The form uses a comprehensive Zod validation schema (`interviewSchedulingSchema`) that includes:

- Required field validation
- Email format validation
- Phone number format validation (international)
- Date validation (must be in the future)
- Conditional validation (specific time required when "specific" preference selected)
- Character limits for text fields

## API Integration

### Endpoint: `POST /api/scheduling/interview`

**Request Body:**
```typescript
{
  name: string;
  email: string;
  phone?: string;
  programInterest: string;
  format: "in-person" | "video" | "phone";
  preferredDate: Date;
  timePreference: "morning" | "afternoon" | "specific";
  specificTime?: string;
  notes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data?: {
    referenceNumber: string;
    schedulingRequest: {
      id: number;
      type: string;
      status: string;
      preferredDate: string;
      timePreference: string;
      format: string;
      programInterest: string;
    };
  };
  error?: string;
}
```

## Database Storage

Interview requests are stored in the `SchedulingRequest` table with the following fields:
- Contact information (name, email, phone)
- Scheduling preferences (date, time, format)
- Program interest
- Status tracking (pending, confirmed, completed, cancelled)
- Session tracking for chat integration

## Usage Examples

### Basic Usage
```tsx
import { InterviewSchedulingForm } from "@/components/scheduling";

function MyComponent() {
  const handleSubmit = async (data) => {
    // Handle form submission
    console.log("Interview data:", data);
  };

  return (
    <InterviewSchedulingForm
      onSubmit={handleSubmit}
      onCancel={() => console.log("Cancelled")}
    />
  );
}
```

### With API Integration
```tsx
import { InterviewSchedulingFormWithApi } from "@/components/scheduling";

function MyComponent() {
  return (
    <InterviewSchedulingFormWithApi
      onSuccess={(refNumber) => {
        console.log("Scheduled with reference:", refNumber);
      }}
    />
  );
}
```

### With Initial Data
```tsx
import { InterviewSchedulingForm } from "@/components/scheduling";

function MyComponent() {
  const initialData = {
    name: "John Doe",
    email: "john@example.com",
    programInterest: "web-development",
  };

  return (
    <InterviewSchedulingForm
      onSubmit={handleSubmit}
      initialData={initialData}
    />
  );
}
```

## Testing

The component includes comprehensive tests covering:
- Form rendering and field presence
- Validation error handling
- Form submission with valid data
- Conditional field display
- Loading states
- Initial data population

Run tests with:
```bash
npm test -- interview-scheduling-form.test.tsx
```

## Styling

The component uses ShadCN UI components with Tailwind CSS for styling:
- Responsive design (mobile-first approach)
- Dark mode support
- Consistent spacing and typography
- Accessible color contrasts
- Loading and disabled states

## Accessibility

The form includes:
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Error message association
- Semantic HTML structure

## Future Enhancements

Potential improvements for future versions:
- Real-time availability checking
- Calendar integration (Google Calendar, Outlook)
- SMS notifications
- Multi-language support
- File attachment support (portfolio, resume)
- Video call link generation
- Automated reminder system