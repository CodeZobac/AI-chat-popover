// Chat utility functions for ETIC AI Chatbot

import {
  type Message,
  type EticAIMessage,
  type ActionButton,
} from "@/types/chat";

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a user message
 */
export function createUserMessage(content: string): Message {
  return {
    id: generateMessageId(),
    role: "user",
    content,
    createdAt: new Date(),
  };
}

/**
 * Create an assistant message
 */
export function createAssistantMessage(
  content: string,
  actionButtons?: ActionButton[]
): EticAIMessage {
  return {
    id: generateMessageId(),
    role: "assistant",
    content,
    createdAt: new Date(),
    metadata: {
      actionButtons,
    },
  };
}

/**
 * Check if a message should show action buttons
 */
export function shouldShowActionButtons(message: Message): boolean {
  if (message.role !== "assistant") return false;

  const content = message.content.toLowerCase();

  // Keywords that might trigger action buttons
  const triggerKeywords = [
    "schedule",
    "interview",
    "tour",
    "visit",
    "call",
    "contact",
    "meet",
    "appointment",
    "interested",
    "apply",
    "admission",
  ];

  return triggerKeywords.some((keyword) => content.includes(keyword));
}

/**
 * Get appropriate action buttons based on message content
 */
export function getActionButtons(message: Message): ActionButton[] {
  if (!shouldShowActionButtons(message)) return [];

  const buttons: ActionButton[] = [];

  // Always show all three options for now
  // In the future, this could be more intelligent based on context
  buttons.push(
    {
      id: "schedule-interview",
      label: "Schedule Interview",
      action: "schedule-interview",
      variant: "default",
    },
    {
      id: "schedule-tour",
      label: "Schedule Tour",
      action: "schedule-tour",
      variant: "outline",
    },
    {
      id: "schedule-call",
      label: "Schedule Call",
      action: "schedule-call",
      variant: "outline",
    }
  );

  return buttons;
}

/**
 * Format message timestamp
 */
export function formatMessageTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Check if two messages are from the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get session storage key for chat history
 */
export function getChatStorageKey(sessionId?: string): string {
  return `etic-ai-chat-${sessionId || "default"}`;
}

/**
 * Save chat messages to session storage
 */
export function saveChatToStorage(
  messages: Message[],
  sessionId?: string
): void {
  try {
    const key = getChatStorageKey(sessionId);
    sessionStorage.setItem(key, JSON.stringify(messages));
  } catch (error) {
    console.warn("Failed to save chat to storage:", error);
  }
}

/**
 * Load chat messages from session storage
 */
export function loadChatFromStorage(sessionId?: string): Message[] {
  try {
    const key = getChatStorageKey(sessionId);
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to load chat from storage:", error);
    return [];
  }
}

/**
 * Clear chat history from storage
 */
export function clearChatStorage(sessionId?: string): void {
  try {
    const key = getChatStorageKey(sessionId);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to clear chat storage:", error);
  }
}

/**
 * Validate message content
 */
export function isValidMessage(content: string): boolean {
  return content.trim().length > 0 && content.trim().length <= 2000;
}

/**
 * Sanitize message content
 */
export function sanitizeMessage(content: string): string {
  return content.trim().slice(0, 2000);
}
