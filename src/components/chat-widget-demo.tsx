"use client";

import { ChatWidget } from "./chat-widget";

export function ChatWidgetDemo() {
  return (
    <div className="relative">
      {/* Demo content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            ETIC AI Chatbot Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This is a demo page to test the chatbot widget. The chat icon should
            appear in the bottom-right corner of the screen. Click it to open
            the chat interface.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Features Demonstrated:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Floating chat widget icon with smooth animations</li>
              <li>• Notification badge for new messages</li>
              <li>• Responsive popover chat interface</li>
              <li>• Proper z-index management</li>
              <li>• Mobile-friendly design</li>
              <li>• Hover effects and micro-interactions</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Test Instructions:</h2>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Look for the chat icon in the bottom-right corner</li>
              <li>Hover over the icon to see the tooltip</li>
              <li>Click the icon to open the chat interface</li>
              <li>
                Try typing a message (note: AI responses require API setup)
              </li>
              <li>Click the X icon to close the chat</li>
              <li>Test on different screen sizes for responsiveness</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget
        position="bottom-right"
        theme="light"
        sessionId="demo-session"
      />
    </div>
  );
}
