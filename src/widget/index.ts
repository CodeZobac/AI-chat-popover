import "./styles.css";
import { EticAIWidget } from "./widget";
import { WidgetConfig } from "./types";

// Global interface for the widget
declare global {
  interface Window {
    EticAI?: {
      config?: WidgetConfig;
      init?: (config?: WidgetConfig) => void;
      destroy?: () => void;
    };
    // EticAIWidget?: typeof EticAIWidget;
  }
}

// Auto-initialize if config is available
if (typeof window !== "undefined") {
  // Skip global assignment during build to avoid type conflicts
  if (process.env.NODE_ENV !== "production") {
    // Make the widget class available globally in development
    Object.defineProperty(window, "EticAIWidget", {
      value: EticAIWidget,
      writable: true,
      configurable: true,
    });
  }

  // Auto-initialize if config is present
  if (window.EticAI?.config) {
    const widget = new EticAIWidget(window.EticAI.config);
    widget.init();

    // Provide global methods
    window.EticAI.init = (config?: WidgetConfig) => {
      const newWidget = new EticAIWidget(config || window.EticAI!.config!);
      newWidget.init();
    };

    window.EticAI.destroy = () => {
      widget.destroy();
    };
  }
}

export { EticAIWidget };
export type { WidgetConfig } from "./types";
