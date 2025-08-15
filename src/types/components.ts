import { ReactNode } from "react";
import { Program } from "./database";
import { ChatMessage, WidgetConfig, WidgetState } from "./api";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Hero section component props
export interface HeroSectionProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  showAnimation?: boolean;
}

// Chatbot widget props
export interface ChatbotWidgetProps extends BaseComponentProps {
  config?: Partial<WidgetConfig>;
  initialState?: Partial<WidgetState>;
  onStateChange?: (state: WidgetState) => void;
  onMessageSent?: (message: string) => void;
  onSchedulingTriggered?: (type: "interview" | "tour" | "call") => void;
}

// Chat interface props
export interface ChatInterfaceProps extends BaseComponentProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage: (message: string) => void;
  onActionClick?: (action: string, data?: Record<string, unknown>) => void;
  placeholder?: string;
  showTypingIndicator?: boolean;
  maxHeight?: number;
  allowFileUpload?: boolean;
  suggestedQuestions?: string[];
}

// Message component props
export interface MessageProps extends BaseComponentProps {
  message: ChatMessage;
  isOwn?: boolean;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  onActionClick?: (action: string, data?: Record<string, unknown>) => void;
  onCopy?: (content: string) => void;
}

// Scheduling form props
export interface BaseSchedulingFormProps extends BaseComponentProps {
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<Record<string, unknown>>;
  programs?: Program[];
}

export interface InterviewSchedulingFormProps
  extends Omit<BaseSchedulingFormProps, "onSubmit"> {
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
    programInterest: string;
    format: "in-person" | "video" | "phone";
    preferredDate: Date;
    timePreference: "morning" | "afternoon" | "specific";
    specificTime?: string;
    notes?: string;
  }) => void;
}

export interface TourSchedulingFormProps
  extends Omit<BaseSchedulingFormProps, "onSubmit"> {
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
    preferredDate: Date;
    timePreference: "morning" | "afternoon" | "specific";
    specificTime?: string;
    groupSize: number;
    specialRequirements?: string;
    notes?: string;
  }) => void;
}

export interface CallSchedulingFormProps
  extends Omit<BaseSchedulingFormProps, "onSubmit"> {
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
    preferredDate: Date;
    timePreference: "morning" | "afternoon" | "specific";
    specificTime?: string;
    callPurpose: string;
    timezone?: string;
    notes?: string;
  }) => void;
}

// Calendar component props
export interface CalendarProps extends BaseComponentProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  availableTimeSlots?: string[];
  onTimeSlotSelect?: (timeSlot: string) => void;
  selectedTimeSlot?: string;
}

// Action buttons props
export interface ActionButtonsProps extends BaseComponentProps {
  buttons: Array<{
    id: string;
    label: string;
    action: string;
    variant?: "default" | "outline" | "secondary";
    disabled?: boolean;
  }>;
  onButtonClick: (action: string, buttonId: string) => void;
  layout?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

// Notification/Toast props
export interface NotificationProps extends BaseComponentProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }>;
}

// Loading states
export interface LoadingProps extends BaseComponentProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "spinner" | "dots" | "pulse";
}

// Form field props
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "date" | "time";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string }>; // for select fields
  rows?: number; // for textarea
}

// Modal/Dialog props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

// Analytics dashboard props (for admin interface)
export interface AnalyticsDashboardProps extends BaseComponentProps {
  dateRange: {
    start: Date;
    end: Date;
  };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  data?: {
    conversations: number;
    schedulingRequests: number;
    conversionRate: number;
    averageSessionDuration: number;
  };
  isLoading?: boolean;
}

// Program management props
export interface ProgramListProps extends BaseComponentProps {
  programs: Program[];
  onEdit?: (program: Program) => void;
  onDelete?: (programId: string) => void;
  onToggleActive?: (programId: string, isActive: boolean) => void;
  isLoading?: boolean;
}

export interface ProgramFormProps extends BaseComponentProps {
  program?: Program;
  onSubmit: (data: {
    name: string;
    category: string;
    duration: string;
    description: string;
    requirements: string[];
    careerOutcomes: string[];
    scheduleFormat: "full-time" | "part-time" | "evening";
    scheduleDuration: string;
    isActive: boolean;
  }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Embeddable widget specific props
export interface EmbeddableWidgetProps {
  config: WidgetConfig;
  containerId?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

// Theme provider props
export interface ThemeProviderProps extends BaseComponentProps {
  theme?: "light" | "dark" | "auto";
  primaryColor?: string;
  accentColor?: string;
  borderRadius?: number;
  fontFamily?: string;
}

// Utility types for component variants
export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";
export type InputVariant = "default" | "destructive";
export type CardVariant = "default" | "outline" | "elevated";

// Event handler types
export type MessageHandler = (message: string) => void;
export type ActionHandler = (
  action: string,
  data?: Record<string, unknown>
) => void;
export type SchedulingHandler = (
  type: "interview" | "tour" | "call",
  data: Record<string, unknown>
) => void;
export type ErrorHandler = (error: Error) => void;
