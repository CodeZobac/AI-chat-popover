// Database types
export * from "./database";

// Validation schemas and types
export * from "./validation";

// API types
export * from "./api";

// Component types
export * from "./components";

// Re-export commonly used types for convenience
export type {
  UserSession,
  Message,
  SchedulingRequest,
  Program,
  MessageMetadata,
  ActionButton,
} from "./database";

export type {
  InterviewSchedulingFormData,
  TourSchedulingFormData,
  CallSchedulingFormData,
  ContactInfoFormData,
} from "./validation";

export type {
  ApiResponse,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  WidgetConfig,
  WidgetState,
} from "./api";

export type {
  ChatbotWidgetProps,
  ChatInterfaceProps,
  MessageProps,
  InterviewSchedulingFormProps,
  TourSchedulingFormProps,
  CallSchedulingFormProps,
} from "./components";
