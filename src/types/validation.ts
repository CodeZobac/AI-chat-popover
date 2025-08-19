import { z } from "zod";

// Base contact information schema
export const contactInfoSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      // Basic phone validation - allows various formats
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
    }, "Please enter a valid phone number"),
});

// Interview scheduling form schema
export const interviewSchedulingSchema = z
  .object({
    ...contactInfoSchema.shape,
    programInterest: z.string().min(1, "Please select a program of interest"),
    format: z.enum(["in-person", "video", "phone"], {
      required_error: "Please select an interview format",
    }),
    preferredDate: z
      .date({
        required_error: "Please select a preferred date",
      })
      .refine((date) => date > new Date(), "Date must be in the future"),
    timePreference: z.enum(["morning", "afternoon", "specific"], {
      required_error: "Please select a time preference",
    }),
    specificTime: z.string().optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      // If time preference is "specific", specificTime is required
      if (data.timePreference === "specific") {
        return data.specificTime && data.specificTime.length > 0;
      }
      return true;
    },
    {
      message:
        "Please specify a time when selecting 'specific' time preference",
      path: ["specificTime"],
    }
  );

// Tour scheduling form schema
export const tourSchedulingSchema = z
  .object({
    ...contactInfoSchema.shape,
    preferredDate: z
      .date({
        required_error: "Please select a preferred date",
      })
      .refine((date) => date > new Date(), "Date must be in the future"),
    timePreference: z.enum(["morning", "afternoon", "specific"], {
      required_error: "Please select a time preference",
    }),
    specificTime: z.string().optional(),
    groupSize: z
      .number()
      .min(1, "Group size must be at least 1")
      .max(20, "Group size cannot exceed 20")
      .default(1),
    specialRequirements: z
      .string()
      .max(300, "Special requirements must be less than 300 characters")
      .optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.timePreference === "specific") {
        return data.specificTime && data.specificTime.length > 0;
      }
      return true;
    },
    {
      message:
        "Please specify a time when selecting 'specific' time preference",
      path: ["specificTime"],
    }
  );

// Call scheduling form schema
export const callSchedulingSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required for call scheduling")
      .refine((phone) => {
        // Basic phone validation - allows various formats
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
      }, "Please enter a valid phone number"),
    preferredDate: z
      .date({
        required_error: "Please select a preferred date",
      })
      .refine((date) => date > new Date(), "Date must be in the future"),
    timePreference: z.enum(["morning", "afternoon", "specific"], {
      required_error: "Please select a time preference",
    }),
    specificTime: z.string().optional(),
    callPurpose: z
      .string()
      .min(1, "Please specify the purpose of the call")
      .max(200, "Call purpose must be less than 200 characters"),
    timezone: z.string().optional(),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.timePreference === "specific") {
        return data.specificTime && data.specificTime.length > 0;
      }
      return true;
    },
    {
      message:
        "Please specify a time when selecting 'specific' time preference",
      path: ["specificTime"],
    }
  );

// Message creation schema
export const messageSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  role: z.enum(["user", "assistant"], {
    required_error: "Role must be either 'user' or 'assistant'",
  }),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(5000, "Message content must be less than 5000 characters"),
  metadata: z
    .object({
      intent: z.string().optional(),
      confidence: z.number().min(0).max(1).optional(),
      actionButtons: z
        .array(
          z.object({
            id: z.string(),
            label: z.string(),
            action: z.enum([
              "schedule_interview",
              "schedule_tour",
              "schedule_call",
            ]),
            variant: z.enum(["default", "outline", "secondary"]).optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

// Program creation/update schema
export const programSchema = z.object({
  name: z
    .string()
    .min(1, "Program name is required")
    .max(200, "Program name must be less than 200 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .max(100, "Duration must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  requirements: z.array(
    z.string().max(200, "Each requirement must be less than 200 characters")
  ),
  careerOutcomes: z.array(
    z.string().max(200, "Each career outcome must be less than 200 characters")
  ),
  scheduleFormat: z.enum(["full-time", "part-time", "evening"], {
    required_error: "Schedule format is required",
  }),
  scheduleDuration: z
    .string()
    .min(1, "Schedule duration is required")
    .max(100, "Schedule duration must be less than 100 characters"),
  isActive: z.boolean().default(true),
});

// Type inference from schemas
export type InterviewSchedulingFormData = z.infer<
  typeof interviewSchedulingSchema
>;
export type TourSchedulingFormData = z.infer<typeof tourSchedulingSchema>;
export type CallSchedulingFormData = z.infer<typeof callSchedulingSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type ProgramFormData = z.infer<typeof programSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
