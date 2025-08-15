"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CHAT_CONFIG } from "@/lib/chat-config";
import type { ChatWidgetState, ChatWidgetProps } from "@/types/chat";

interface ChatWidgetIconProps extends ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
  hasNewMessages?: boolean;
}

export function ChatWidgetIcon({
  isOpen,
  onToggle,
  unreadCount = 0,
  hasNewMessages = false,
  className,
  position = "bottom-right",
  theme = "light",
  primaryColor,
}: ChatWidgetIconProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show widget after a brief delay to avoid flash
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Position classes based on position prop
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  // Theme-based styling
  const themeStyles = {
    light: {
      background: "bg-primary text-primary-foreground",
      hover: "hover:bg-primary/90",
      shadow: "shadow-lg hover:shadow-xl",
    },
    dark: {
      background: "bg-gray-800 text-white",
      hover: "hover:bg-gray-700",
      shadow: "shadow-lg hover:shadow-xl",
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed z-[9999] flex items-center justify-center",
            positionClasses[position],
            className
          )}
          initial={CHAT_CONFIG.animations.widget.initial}
          animate={CHAT_CONFIG.animations.widget.animate}
          exit={CHAT_CONFIG.animations.widget.exit}
          transition={CHAT_CONFIG.animations.widget.transition}
        >
          {/* Main widget button */}
          <Button
            onClick={onToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "relative h-14 w-14 rounded-full p-0 transition-all duration-300",
              currentTheme.background,
              currentTheme.hover,
              currentTheme.shadow,
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "active:scale-95"
            )}
            style={{
              backgroundColor: primaryColor,
            }}
            aria-label={isOpen ? "Close chat" : "Open chat"}
            aria-expanded={isOpen}
          >
            {/* Icon with rotation animation */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </motion.div>

            {/* Notification badge */}
            <AnimatePresence>
              {!isOpen && (hasNewMessages || unreadCount > 0) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge
                    variant="destructive"
                    className={cn(
                      "h-6 min-w-6 rounded-full px-1 text-xs font-bold",
                      "flex items-center justify-center",
                      "animate-pulse"
                    )}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount || "!"}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse animation for new messages */}
            <AnimatePresence>
              {!isOpen && hasNewMessages && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </AnimatePresence>
          </Button>

          {/* Tooltip/Label on hover */}
          <AnimatePresence>
            {isHovered && !isOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: position === "bottom-right" ? 10 : -10,
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  x: position === "bottom-right" ? 10 : -10,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg",
                  position === "bottom-right" ? "right-16" : "left-16"
                )}
              >
                Need help? Chat with ETIC AI
                {/* Tooltip arrow */}
                <div
                  className={cn(
                    "absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900",
                    position === "bottom-right" ? "-right-1" : "-left-1"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing widget state
export function useChatWidget() {
  const [state, setState] = useState<ChatWidgetState>({
    isOpen: false,
    hasNewMessages: false,
    unreadCount: 0,
  });

  const toggleWidget = () => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      // Clear notifications when opening
      hasNewMessages: prev.isOpen ? prev.hasNewMessages : false,
      unreadCount: prev.isOpen ? prev.unreadCount : 0,
    }));
  };

  const addNotification = () => {
    setState((prev) => ({
      ...prev,
      hasNewMessages: true,
      unreadCount: prev.unreadCount + 1,
    }));
  };

  const clearNotifications = () => {
    setState((prev) => ({
      ...prev,
      hasNewMessages: false,
      unreadCount: 0,
    }));
  };

  return {
    ...state,
    toggleWidget,
    addNotification,
    clearNotifications,
  };
}
