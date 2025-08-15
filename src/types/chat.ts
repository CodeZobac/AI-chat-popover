// Chat-related TypeScript types for ETIC AI Chatbot

export interface Message {
  id: string;
  role: "user" | "assistant" | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  toolInvocations?: ToolInvocation[];
  parts?: MessagePart[];
}

export interface Attachment {
  name: string;
  contentType: string;
  size: number;
  url: string;
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export type MessagePart =
  | TextPart
  | ReasoningPart
  | ToolCallPart
  | ToolResultPart
  | StepStartPart;

export interface TextPart {
  type: "text";
  text: string;
}

export interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
}

export interface ToolCallPart {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

export interface ToolResultPart {
  type: "tool-result";
  toolCallId: string;
  result: unknown;
}

export interface StepStartPart {
  type: "step-start";
  step: string;
}

// Chat component props
export interface ChatProps {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  messages: Array<Message>;
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: "thumbs-up" | "thumbs-down"
  ) => void;
  setMessages?: (messages: Message[]) => void;
  transcribeAudio?: (blob: Blob) => Promise<string>;
  append?: (message: { role: "user"; content: string }) => void;
  suggestions?: string[];
}

// Widget-specific types
export interface ChatWidgetState {
  isOpen: boolean;
  hasNewMessages: boolean;
  unreadCount: number;
}

export interface ChatWidgetProps {
  className?: string;
  position?: "bottom-left" | "bottom-right";
  theme?: "light" | "dark";
  primaryColor?: string;
}

// ETIC AI specific types
export interface EticAIMessage extends Message {
  metadata?: {
    intent?: string;
    confidence?: number;
    actionButtons?: ActionButton[];
  };
}

export interface ActionButton {
  id: string;
  label: string;
  action: "schedule-interview" | "schedule-tour" | "schedule-call";
  variant?: "default" | "outline" | "secondary";
}

// Scheduling related types
export interface SchedulingRequest {
  id: string;
  sessionId: string;
  type: "interview" | "tour" | "call";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  preferences: {
    date?: Date;
    timePreference?: "morning" | "afternoon" | "specific";
    specificTime?: string;
    format?: "in-person" | "video" | "phone";
    programInterest?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
