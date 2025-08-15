import { SchedulingRequest, Program, UserSession } from "./database";

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response for list endpoints
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Chat API specific types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    actionButtons?: Array<{
      id: string;
      label: string;
      action: string;
      variant?: string;
    }>;
  };
}

export interface ChatRequest {
  messages: ChatMessage[];
  sessionId: string;
  context?: {
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface ChatResponse extends ApiResponse {
  data?: {
    message: ChatMessage;
    sessionId: string;
    suggestedActions?: string[];
  };
}

// Scheduling API types
export interface CreateSchedulingRequest {
  sessionId: string;
  type: "interview" | "tour" | "call";
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredDate?: Date;
  timePreference?: "morning" | "afternoon" | "specific";
  specificTime?: string;
  format?: "in-person" | "video" | "phone";
  programInterest?: string;
  notes?: string;
  // Tour-specific fields
  groupSize?: number;
  specialRequirements?: string;
  // Call-specific fields
  callPurpose?: string;
  timezone?: string;
}

export interface UpdateSchedulingRequest {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  preferredDate?: Date;
  timePreference?: "morning" | "afternoon" | "specific";
  specificTime?: string;
  notes?: string;
}

export interface SchedulingResponse extends ApiResponse {
  data?: {
    schedulingRequest: SchedulingRequest;
    referenceNumber: string;
  };
}

// Session API types
export interface CreateSessionRequest {
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionResponse extends ApiResponse {
  data?: {
    session: UserSession;
    sessionId: string;
  };
}

// Program API types
export interface ProgramsResponse extends ApiResponse {
  data?: Program[];
}

export interface ProgramResponse extends ApiResponse {
  data?: Program;
}

// Analytics and reporting types
export interface ConversationAnalytics {
  sessionId: string;
  messageCount: number;
  duration: number; // in minutes
  intents: string[];
  schedulingActions: number;
  completedScheduling: boolean;
  userSatisfaction?: number;
}

export interface SchedulingAnalytics {
  totalRequests: number;
  requestsByType: {
    interview: number;
    tour: number;
    call: number;
  };
  requestsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  conversionRate: number;
  averageResponseTime: number;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
}

// Widget configuration types (for embeddable widget)
export interface WidgetConfig {
  apiKey: string;
  theme?: "light" | "dark" | "auto";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  accentColor?: string;
  borderRadius?: number;
  showBranding?: boolean;
  initialMessage?: string;
  suggestedQuestions?: string[];
  allowFileUpload?: boolean;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
}

export interface WidgetState {
  isOpen: boolean;
  isMinimized: boolean;
  hasUnreadMessages: boolean;
  currentSession?: string;
  messageCount: number;
}

// Webhook types (for external integrations)
export interface WebhookPayload {
  event: "scheduling_created" | "scheduling_updated" | "conversation_ended";
  timestamp: Date;
  sessionId: string;
  data: Record<string, unknown>;
}

export interface WebhookResponse {
  received: boolean;
  processed: boolean;
  error?: string;
}
