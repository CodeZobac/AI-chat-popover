import React, { useState, useEffect, useRef } from 'react';
import { WidgetConfig, ChatMessage } from '../types';

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface StandaloneChatWidgetProps {
  config: WidgetConfig;
  onMessage: (type: string, data: any) => void;
}

export function StandaloneChatWidget({ config, onMessage }: StandaloneChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(config.autoOpen || false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  const chatPositionClasses = {
    'bottom-right': 'bottom-24 right-6',
    'bottom-left': 'bottom-24 left-6',
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle widget toggle
  const toggleWidget = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      setHasNewMessages(false);
      setUnreadCount(0);
      onMessage('open', {});
    } else {
      onMessage('close', {});
    }
  };

  // Handle message submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Make API call to chat endpoint
      const response = await fetch(config.apiEndpoint || '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const content = line.slice(2);
                assistantMessage.content += content;
                
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  )
                );
              } catch (parseError) {
                console.error('Error parsing stream chunk:', parseError);
              }
            }
          }
        }
      }

      // Add notification if widget is closed
      if (!isOpen) {
        setHasNewMessages(true);
        setUnreadCount(prev => prev + 1);
      }

      onMessage('message', { message: assistantMessage });
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.",
        createdAt: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSubmit(), 0);
  };

  // Welcome message
  useEffect(() => {
    if (config.showWelcomeMessage && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm ETIC AI, your virtual assistant. I'm here to help you learn about ETIC Algarve's programs and answer any questions you might have. How can I assist you today?",
        createdAt: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [config.showWelcomeMessage, messages.length]);

  const suggestions = [
    "Tell me about ETIC Algarve programs",
    "How can I schedule an interview?",
    "What courses do you offer?",
    "I'd like to book a campus tour",
  ];

  return (
    <div>
      {/* Chat Widget Button */}
      <div className={`fixed z-50 ${positionClasses[config.position || 'bottom-right']}`}>
        <button
          onClick={toggleWidget}
          className="widget-button w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
          
          {/* Notification badge */}
          {!isOpen && (hasNewMessages || unreadCount > 0) && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
              {unreadCount > 99 ? '99+' : unreadCount || '!'}
            </div>
          )}
        </button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed z-40 w-96 h-96 widget-chat-container animate-fade-in ${chatPositionClasses[config.position || 'bottom-right']}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{ backgroundColor: config.primaryColor || '#2563eb' }}
              >
                AI
              </div>
              <div>
                <h3 className="font-semibold text-sm">ETIC AI Assistant</h3>
                <p className="text-xs text-gray-600">
                  {isLoading ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleWidget}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Send
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              Powered by ETIC AI • Always here to help
            </p>
          </div>
        </div>
      )}
    </div>
  );
}