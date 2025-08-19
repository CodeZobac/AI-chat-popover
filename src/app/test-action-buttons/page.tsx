"use client";

import { ChatMessage } from "@/components/ui/chat-message";

export default function TestActionButtonsPage() {
  // Mock messages to test action buttons
  const mockMessages = [
    {
      id: "test-message-1",
      role: "assistant" as const,
      content: "Hello! I'm ETIC AI, your assistant for exploring ETIC Algarve programs.",
      createdAt: new Date(),
    },
    {
      id: "test-message-2", 
      role: "user" as const,
      content: "Hi there! I'm interested in learning more about your programs.",
      createdAt: new Date(),
    },
    {
      id: "test-message-3",
      role: "assistant" as const,
      content: "Great! I can help you learn about our courses, schedule interviews, book campus tours, or arrange calls with our admissions team. What would you like to know?",
      createdAt: new Date(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Action Buttons Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Chat Messages with Action Buttons</h2>
          
          <div className="space-y-4">
            {mockMessages.map((message, index) => {
              const isLastAssistantMessage = 
                message.role === "assistant" && 
                index === mockMessages.length - 1;
              
              return (
                <ChatMessage 
                  key={message.id}
                  {...message} 
                  isLastAssistantMessage={isLastAssistantMessage}
                />
              );
            })}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Expected Behavior:</h3>
            <ul className="text-sm space-y-1">
              <li>• User messages should NOT have action buttons</li>
              <li>• Only the LAST assistant message should have action buttons</li>
              <li>• Buttons should be: &quot;Schedule Interview&quot;, &quot;Schedule Tour&quot;, &quot;Schedule Call&quot;</li>
              <li>• Clicking buttons should open respective scheduling dialogs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}