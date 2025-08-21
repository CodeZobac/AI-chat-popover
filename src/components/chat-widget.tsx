"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// Note: Using custom implementation instead of useChat due to version compatibility
import { ChatWidgetIcon, useChatWidget } from "./chat-widget-icon";
import { Chat } from "@/components/ui/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CHAT_CONFIG } from "@/lib/chat-config";
import { saveChatToStorage, loadChatFromStorage } from "@/lib/chat-utils";
import type { ChatWidgetProps } from "@/types/chat";

interface ChatWidgetComponentProps extends ChatWidgetProps {
  sessionId?: string;
  apiEndpoint?: string;
}

export function ChatWidget({
  className,
  position = "bottom-right",
  theme = "light",
  primaryColor,
  sessionId,
  apiEndpoint = "/api/chat",
}: ChatWidgetComponentProps) {
  const widgetState = useChatWidget();
  const [isInitialized, setIsInitialized] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Chat state management
  interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Stop function
  const stop = () => {
    setIsLoading(false);
  };

  // Submit handler with API integration
  const customHandleSubmit = async (e?: { preventDefault?: () => void }) => {
    if (e?.preventDefault) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      createdAt: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the messages for the API, filtering out any previous error messages and empty messages
      const messagesToSend = [...messages, userMessage]
        .filter(
          (msg) =>
            msg.content.trim() !== "" &&
            msg.content !==
              "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment."
        )
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      console.log("Sending messages to API:", messagesToSend);

      // Call the chat API
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "",
        createdAt: new Date(),
      };

      // Add empty assistant message
      setMessages((prev) => [...prev, assistantMessage]);

      // Read the stream
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          assistantMessage.content += chunk;

          // Update the assistant message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: assistantMessage.content }
                : msg
            )
          );
        }
      }

      // Add notification if widget is closed
      if (!widgetState.isOpen) {
        widgetState.addNotification();
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err as Error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant" as const,
        content:
          "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle append (for suggestions)
  const append = (message: { role: "user"; content: string }) => {
    setInput(message.content);
    setTimeout(() => customHandleSubmit(), 0);
  };

  // Load chat history on mount
  useEffect(() => {
    if (!isInitialized) {
      const savedMessages = loadChatFromStorage(sessionId);
      if (savedMessages.length > 0) {
        // Convert saved messages to the format expected by the chat
        const convertedMessages: ChatMessage[] = savedMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          createdAt: new Date(msg.createdAt || Date.now()),
        }));
        setMessages(convertedMessages);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, sessionId, setMessages]);

  // Save messages to storage whenever they change
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      // Convert messages to storage format
      const messagesToSave = messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || new Date(),
      }));
      saveChatToStorage(
        messagesToSave as unknown as import("@/types/chat").Message[],
        sessionId
      );
    }
  }, [messages, sessionId, isInitialized]);

  // Clear notifications when widget is opened
  useEffect(() => {
    if (widgetState.isOpen) {
      widgetState.clearNotifications();
    }
  }, [widgetState.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && widgetState.isOpen) {
        widgetState.toggleWidget();
      }
    };

    if (widgetState.isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [widgetState.isOpen, widgetState]);

  return (
    <>
      {/* Chat Widget Icon */}
      <ChatWidgetIcon
        isOpen={widgetState.isOpen}
        onToggle={widgetState.toggleWidget}
        unreadCount={widgetState.unreadCount}
        hasNewMessages={widgetState.hasNewMessages}
        position={position}
        theme={theme}
        primaryColor={primaryColor}
        className={className}
      />

      {/* Chat Popover */}
      <AnimatePresence>
        {widgetState.isOpen && (
          <motion.div
            ref={chatContainerRef}
            className={cn(
              "fixed z-[9998] flex flex-col",
              // Desktop sizing with better constraints
              "w-[400px] h-[600px] max-h-[calc(100vh-6rem)]",
              // Mobile sizing - full screen on small devices
              "md:max-w-[calc(100vw-2rem)] md:max-h-[calc(100vh-8rem)]",
              "max-md:inset-4 max-md:w-auto max-md:h-auto",
              "bg-background border border-border rounded-lg shadow-2xl",
              "overflow-hidden",
              // Position widget above the icon - icon is at bottom-6, transform to place widget above
              position === "bottom-right"
                ? "md:bottom-6 md:right-6 md:transform md:translate-y-[-100%] md:-translate-y-4"
                : "md:bottom-6 md:left-6 md:transform md:translate-y-[-100%] md:-translate-y-4",
              // Center on mobile
              "max-md:top-4 max-md:left-4 max-md:right-4 max-md:bottom-4"
            )}
            initial={CHAT_CONFIG.animations.popover.initial}
            animate={CHAT_CONFIG.animations.popover.animate}
            exit={CHAT_CONFIG.animations.popover.exit}
            transition={CHAT_CONFIG.animations.popover.transition}
            style={{
              minWidth: CHAT_CONFIG.widget.size.minWidth,
              minHeight: CHAT_CONFIG.widget.size.minHeight,
            }}
            role="dialog"
            aria-label="ETIC AI Chat Assistant"
            aria-modal="false"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="text-primary-foreground text-sm font-bold">
                    AI
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">ETIC AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>

              {/* Status indicator and close button */}
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                  )}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={widgetState.toggleWidget}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col min-h-0">
              {error && (
                <div className="p-4 bg-destructive/10 border-b border-destructive/20">
                  <p className="text-sm text-destructive">
                    I&apos;m experiencing some technical difficulties. Please
                    try again in a moment.
                  </p>
                </div>
              )}

              <Chat
                messages={messages}
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={customHandleSubmit}
                isGenerating={isLoading}
                stop={stop}
                append={append}
                suggestions={
                  messages.length === 0 ? [...CHAT_CONFIG.suggestions] : []
                }
                className="flex-1 border-0"
                setMessages={setMessages}
              />
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Powered by ETIC AI • Always here to help
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {widgetState.isOpen && (
          <motion.div
            className="fixed inset-0 z-[9997] bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={widgetState.toggleWidget}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Export the hook for external use
export { useChatWidget };
