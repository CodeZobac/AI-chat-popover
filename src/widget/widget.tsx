import React from "react";
import { createRoot, Root } from "react-dom/client";
import { WidgetConfig, WidgetMessage } from "./types";
import { StandaloneChatWidget } from "./components/StandaloneChatWidget";

export class EticAIWidget {
  private config: WidgetConfig;
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private reactRoot: Root | null = null;
  private isInitialized = false;
  private messageHandlers: Map<string, (data: unknown) => void> = new Map();

  constructor(config: WidgetConfig) {
    this.config = {
      theme: "light",
      position: "bottom-right",
      apiEndpoint: "/api/chat",
      allowedOrigins: ["*"],
      autoOpen: false,
      showWelcomeMessage: true,
      ...config,
    };

    // Bind methods
    this.handleMessage = this.handleMessage.bind(this);
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  public init(): void {
    if (this.isInitialized) {
      console.warn("EticAIWidget is already initialized");
      return;
    }

    try {
      this.createContainer();
      this.setupShadowDOM();
      this.injectStyles();
      this.renderWidget();
      this.setupMessageHandlers();
      this.isInitialized = true;

      console.log("EticAIWidget initialized successfully");
    } catch (error) {
      console.error("Failed to initialize EticAIWidget:", error);
    }
  }

  public destroy(): void {
    if (!this.isInitialized) {
      return;
    }

    // Clean up React
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }

    // Remove container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Clean up message handlers
    window.removeEventListener("message", this.handleMessage);
    this.messageHandlers.clear();

    this.container = null;
    this.shadowRoot = null;
    this.isInitialized = false;

    console.log("EticAIWidget destroyed");
  }

  public updateConfig(newConfig: Partial<WidgetConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.isInitialized) {
      this.renderWidget();
    }
  }

  private createContainer(): void {
    this.container = document.createElement("div");
    this.container.id = "etic-ai-widget-container";
    this.container.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
    document.body.appendChild(this.container);
  }

  private setupShadowDOM(): void {
    if (!this.container) {
      throw new Error("Container not created");
    }

    // Create shadow root for style isolation
    this.shadowRoot = this.container.attachShadow({ mode: "open" });

    // Create a div inside shadow root for React
    const reactContainer = document.createElement("div");
    reactContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    this.shadowRoot.appendChild(reactContainer);
  }

  private injectStyles(): void {
    if (!this.shadowRoot) {
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      /* Tailwind-like utility classes */
      .fixed { position: fixed; }
      .absolute { position: absolute; }
      .relative { position: relative; }
      .z-50 { z-index: 50; }
      .z-40 { z-index: 40; }
      
      .bottom-6 { bottom: 1.5rem; }
      .right-6 { right: 1.5rem; }
      .left-6 { left: 1.5rem; }
      .bottom-24 { bottom: 6rem; }
      
      .w-14 { width: 3.5rem; }
      .h-14 { height: 3.5rem; }
      .w-96 { width: 24rem; }
      .h-96 { height: 24rem; }
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      
      .rounded-full { border-radius: 9999px; }
      .rounded-lg { border-radius: 0.5rem; }
      
      .bg-blue-600 { background-color: #2563eb; }
      .bg-white { background-color: #ffffff; }
      .bg-gray-900 { background-color: #111827; }
      .text-white { color: #ffffff; }
      .text-gray-600 { color: #4b5563; }
      
      .shadow-lg { 
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
      }
      .shadow-xl { 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
      }
      
      .border { border-width: 1px; }
      .border-gray-200 { border-color: #e5e7eb; }
      
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .flex-col { flex-direction: column; }
      
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      
      .cursor-pointer { cursor: pointer; }
      .pointer-events-auto { pointer-events: auto; }
      .pointer-events-none { pointer-events: none; }
      
      .transition-all { transition-property: all; }
      .duration-300 { transition-duration: 300ms; }
      .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
      
      .hover\\:shadow-xl:hover { 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
      }
      .hover\\:scale-105:hover { transform: scale(1.05); }
      
      .font-semibold { font-weight: 600; }
      .text-sm { font-size: 0.875rem; }
      .text-xs { font-size: 0.75rem; }
      
      /* Custom widget styles */
      .widget-button {
        background: ${this.config.primaryColor || "#2563eb"};
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        pointer-events: auto;
      }
      
      .widget-button:hover {
        transform: scale(1.05);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      
      .widget-chat-container {
        pointer-events: auto;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      
      /* Animation keyframes */
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      
      .animate-fade-out {
        animation: fadeOut 0.3s ease-out;
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .widget-chat-container {
          position: fixed !important;
          top: 1rem !important;
          left: 1rem !important;
          right: 1rem !important;
          bottom: 1rem !important;
          width: auto !important;
          height: auto !important;
        }
      }
    `;

    this.shadowRoot.appendChild(style);
  }

  private renderWidget(): void {
    if (!this.shadowRoot) {
      return;
    }

    const reactContainer = this.shadowRoot.querySelector("div");
    if (!reactContainer) {
      return;
    }

    if (!this.reactRoot) {
      this.reactRoot = createRoot(reactContainer);
    }

    this.reactRoot.render(
      React.createElement(StandaloneChatWidget, {
        config: this.config,
        onMessage: this.sendMessage.bind(this),
      })
    );
  }

  private setupMessageHandlers(): void {
    window.addEventListener("message", this.handleMessage);
  }

  private handleMessage(event: MessageEvent<WidgetMessage>): void {
    // Validate origin if specified
    if (
      this.config.allowedOrigins &&
      !this.config.allowedOrigins.includes("*")
    ) {
      if (!this.config.allowedOrigins.includes(event.origin)) {
        return;
      }
    }

    const { type, data } = event.data;

    switch (type) {
      case "init":
        this.init();
        break;
      case "config":
        if (data && typeof data === "object") {
          this.updateConfig(data as Partial<WidgetConfig>);
        }
        break;
      case "open":
        this.sendMessage("widget-opened", {});
        break;
      case "close":
        this.sendMessage("widget-closed", {});
        break;
      default:
        // Handle custom message types
        const handler = this.messageHandlers.get(type);
        if (handler) {
          handler(data);
        }
    }
  }

  private sendMessage(type: string, data: unknown): void {
    if (window.parent !== window) {
      window.parent.postMessage({ type, data, source: "etic-ai-widget" }, "*");
    }

    // Also dispatch custom event for same-origin communication
    window.dispatchEvent(
      new CustomEvent("etic-ai-widget-message", {
        detail: { type, data },
      })
    );
  }

  public on(eventType: string, handler: (data: unknown) => void): void {
    this.messageHandlers.set(eventType, handler);
  }

  public off(eventType: string): void {
    this.messageHandlers.delete(eventType);
  }
}
