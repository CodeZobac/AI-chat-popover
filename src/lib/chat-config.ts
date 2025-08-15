// ETIC AI Chatbot Configuration

export const CHAT_CONFIG = {
  // Widget appearance
  widget: {
    position: "bottom-right" as const,
    size: {
      width: 400,
      height: 600,
      minWidth: 320,
      minHeight: 400,
    },
    zIndex: 9999,
    borderRadius: "12px",
    shadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
  },

  // Chat behavior
  chat: {
    maxMessages: 100,
    typingDelay: 1000,
    autoScroll: true,
    showTimestamps: false,
    enableAudio: true,
    enableFileUpload: false,
  },

  // AI Configuration
  ai: {
    model: "gemini-2.0-flash-exp",
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: `You are ETIC AI, a helpful and knowledgeable assistant for ETIC Algarve school. 

Your role is to:
- Provide accurate information about ETIC Algarve's programs, courses, and facilities
- Guide prospective students through their educational journey
- Suggest scheduling options (interviews, tours, calls) in a natural, non-invasive way
- Maintain a friendly, professional, and welcoming tone

Key guidelines:
- Be conversational and approachable
- Don't be pushy about scheduling - let it flow naturally
- If you don't know specific information, acknowledge it and offer to connect them with school representatives
- Focus on helping students find the right educational path
- Highlight ETIC Algarve's strengths and unique offerings

Available programs include various technology, design, and digital media courses. Always encourage students to explore what interests them most.`,
  },

  // Prompt suggestions for new conversations
  suggestions: [
    "Tell me about ETIC Algarve programs",
    "What courses do you offer in technology?",
    "How can I schedule a campus tour?",
    "What are the admission requirements?",
    "Can I schedule an interview?",
  ],

  // Action buttons configuration
  actions: {
    scheduleInterview: {
      label: "Schedule Interview",
      description: "Book a one-on-one interview with our admissions team",
      icon: "calendar",
    },
    scheduleTour: {
      label: "Schedule Tour",
      description: "Visit our campus and see our facilities",
      icon: "map-pin",
    },
    scheduleCall: {
      label: "Schedule Call",
      description: "Have a phone conversation with our team",
      icon: "phone",
    },
  },

  // Animation settings
  animations: {
    widget: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    popover: {
      initial: { scale: 0.95, opacity: 0, y: 10 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.95, opacity: 0, y: 10 },
      transition: { duration: 0.2 },
    },
    message: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    },
  },
} as const;

export type ChatConfig = typeof CHAT_CONFIG;
