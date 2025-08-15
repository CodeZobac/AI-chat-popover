// Core database model interfaces based on Prisma schema

export interface UserSession {
  id: string;
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  startTime: Date;
  lastActivity: Date;
  messages?: Message[];
  schedulingRequests?: SchedulingRequest[];
}

export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata | null;
  session?: UserSession;
}

export interface MessageMetadata {
  intent?: string;
  confidence?: number;
  actionButtons?: ActionButton[];
}

export interface ActionButton {
  id: string;
  label: string;
  action: "schedule_interview" | "schedule_tour" | "schedule_call";
  variant?: "default" | "outline" | "secondary";
}

export interface SchedulingRequest {
  id: string;
  sessionId: string;
  type: "interview" | "tour" | "call";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  preferredDate: Date | null;
  timePreference: string | null; // "morning" | "afternoon" | "specific"
  specificTime: string | null;
  format: string | null; // "in-person" | "video" | "phone"
  programInterest: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  session?: UserSession;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  duration: string;
  description: string;
  requirements: string[];
  careerOutcomes: string[];
  scheduleFormat: "full-time" | "part-time" | "evening";
  scheduleDuration: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Utility types for different scheduling types
export type SchedulingType = SchedulingRequest["type"];
export type SchedulingStatus = SchedulingRequest["status"];
export type TimePreference = "morning" | "afternoon" | "specific";
export type SchedulingFormat = "in-person" | "video" | "phone";
export type ProgramScheduleFormat = Program["scheduleFormat"];
