"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useChat } from "ai/react";
import { ChatWidgetIcon, useChatWidget } from "./chat-widget-icon";
import { Chat } from "@/components/ui/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CHAT_CONFIG } from "@/lib/chat-config";
import { saveChatToStorage, loadChatFromStorage } from "@/lib/chat-utils";
import type { ChatWidgetProps } from "@/types/chat";
import type { Message } from "@/components/ui/chat-message";

interface ChatWidgetComponentProps extends ChatWidgetProps {
  sessionId?: string;
  apiEndpoint?: string; // Currently unused but kept for future API integration
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

  // Local state for chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // This is a placeholder - in a real implementation, you'd call your API
      // For now, just add a simple response
      setTimeout(() => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Hello! I'm ETIC AI, your virtual assistant. I'm here to help you learn about ETIC Algarve's programs and services. How can I assist you today?",
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);

        // Add notification if widget is closed
        if (!widgetState.isOpen) {
          widgetState.addNotification();
        }
      }, 1000);
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
    }
  };

  // Handle append (for suggestions)
  const append = (message: { role: "user"; content: string }) => {
    setInput(message.content);
    handleSubmit();
  };

  // Placeholder stop function
  const stop = () => {
    setIsLoading(false);
  };

  // Load chat history on mount
  useEffect(() => {
    if (!isInitialized) {
      const savedMessages = loadChatFromStorage(sessionId);
      if (savedMessages.length > 0) {
        setMessages(savedMessages as Message[]);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, sessionId, setMessages]);

  // Save messages to storage whenever they change
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      // Type assertion needed due to different Message interfaces
      saveChatToStorage(
        messages as unknown as import("@/types/chat").Message[],
        sessionId
      );
    }
  }, [messages, sessionId, isInitialized]);

  // Clear notifications when widget is opened
  useEffect(() => {
    if (widgetState.isOpen) {
      widgetState.clearNotifications();
    }
  }, [widgetState.isOpen, widgetState]);

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

  // Position classes for the popover
  const popoverPositionClasses = {
    "bottom-right": "bottom-24 right-6",
    "bottom-left": "bottom-24 left-6",
  };

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
              // Desktop sizing
              "w-[400px] h-[600px]",
              // Mobile sizing - full screen on small devices
              "md:max-w-[calc(100vw-2rem)] md:max-h-[calc(100vh-8rem)]",
              "max-md:inset-4 max-md:w-auto max-md:h-auto",
              "bg-background border border-border rounded-lg shadow-2xl",
              "overflow-hidden",
              // Position only applies on desktop
              "md:" +
                popoverPositionClasses[position].replace(
                  "bottom-24 ",
                  "bottom-24 "
                ),
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
              {messages.length === 0 ? (
                <Chat
                  messages={messages}
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  isGenerating={isLoading}
                  stop={stop}
                  append={append}
                  suggestions={[...CHAT_CONFIG.suggestions]}
                  className="flex-1 border-0"
                  setMessages={setMessages}
                />
              ) : (
                <Chat
                  messages={messages}
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  isGenerating={isLoading}
                  stop={stop}
                  className="flex-1 border-0"
                  setMessages={setMessages}
                />
              )}
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
