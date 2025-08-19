(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.EticAIWidgetLoader) {
    return;
  }

  window.EticAIWidgetLoader = {
    version: "1.0.0",
    loaded: false,
    config: null,
    widget: null,
    iframeMode: false,
    retryCount: 0,
    maxRetries: 3,
  };

  // Default configuration
  const defaultConfig = {
    apiEndpoint: "https://etic-ai.vercel.app/api/chat",
    widgetUrl: "https://etic-ai.vercel.app/widget",
    theme: "light",
    position: "bottom-right",
    primaryColor: "#2563eb",
    secondaryColor: "#f3f4f6",
    textColor: "#374151",
    allowedOrigins: ["*"],
    autoOpen: false,
    showWelcomeMessage: true,
    sessionId: null,
    branding: {
      name: "ETIC AI",
      logo: null,
      showPoweredBy: true,
    },
    customStyles: {},
    debug: false,
    fallbackToIframe: true,
    iframeUrl: null,
  };

  // Generate session ID if not provided
  function generateSessionId() {
    return (
      "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    );
  }

  // Enhanced origin validation with security features
  function isOriginAllowed(allowedOrigins, origin) {
    if (!allowedOrigins || allowedOrigins.includes("*")) {
      return true;
    }

    // Normalize origin (remove trailing slash, convert to lowercase)
    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");

    return allowedOrigins.some((allowed) => {
      const normalizedAllowed = allowed.toLowerCase().replace(/\/$/, "");

      // Exact match
      if (normalizedAllowed === normalizedOrigin) return true;

      // Wildcard subdomain support (*.example.com)
      if (normalizedAllowed.startsWith("*.")) {
        const domain = normalizedAllowed.slice(2);
        return (
          normalizedOrigin.endsWith("." + domain) || normalizedOrigin === domain
        );
      }

      // Protocol-agnostic matching
      if (normalizedAllowed.startsWith("//")) {
        const withoutProtocol = normalizedOrigin.replace(/^https?:/, "");
        return withoutProtocol === normalizedAllowed;
      }

      return false;
    });
  }

  // Security validation for configuration
  function validateConfig(config) {
    const errors = [];

    // Validate URLs
    if (config.apiEndpoint && !isValidUrl(config.apiEndpoint)) {
      errors.push("Invalid API endpoint URL");
    }

    if (config.widgetUrl && !isValidUrl(config.widgetUrl)) {
      errors.push("Invalid widget URL");
    }

    // Validate theme
    if (config.theme && !["light", "dark"].includes(config.theme)) {
      errors.push('Theme must be "light" or "dark"');
    }

    // Validate position
    if (
      config.position &&
      !["bottom-right", "bottom-left"].includes(config.position)
    ) {
      errors.push('Position must be "bottom-right" or "bottom-left"');
    }

    // Validate colors (basic hex color validation)
    const colorFields = ["primaryColor", "secondaryColor", "textColor"];
    colorFields.forEach((field) => {
      if (config[field] && !isValidColor(config[field])) {
        errors.push(`Invalid ${field} format`);
      }
    });

    return errors;
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  function isValidColor(color) {
    // Basic validation for hex colors and CSS color names
    return (
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) ||
      /^rgb\(/.test(color) ||
      /^rgba\(/.test(color) ||
      /^hsl\(/.test(color) ||
      /^hsla\(/.test(color) ||
      ["transparent", "inherit", "currentColor"].includes(color)
    );
  }

  // Load the widget bundle with fallback support
  function loadWidget(config) {
    return new Promise((resolve, reject) => {
      if (window.EticAIWidgetLoader.loaded) {
        resolve();
        return;
      }

      // Try loading the main widget bundle
      loadWidgetScript(config)
        .then(resolve)
        .catch((error) => {
          if (config.debug) {
            console.warn(
              "Failed to load widget script, attempting fallback:",
              error
            );
          }

          // Fallback to iframe if enabled and not already in iframe mode
          if (
            config.fallbackToIframe &&
            !window.EticAIWidgetLoader.iframeMode
          ) {
            loadIframeFallback(config).then(resolve).catch(reject);
          } else {
            reject(error);
          }
        });
    });
  }

  function loadWidgetScript(config) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        (config.widgetUrl || "https://etic-ai.vercel.app/widget") +
        "/etic-ai-widget.js";
      script.async = true;
      script.crossOrigin = "anonymous";

      const timeout = setTimeout(() => {
        reject(new Error("Widget script load timeout"));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        window.EticAIWidgetLoader.loaded = true;
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Failed to load ETIC AI Widget script"));
      };

      document.head.appendChild(script);
    });
  }

  // Iframe fallback for maximum compatibility
  function loadIframeFallback(config) {
    return new Promise((resolve, reject) => {
      try {
        window.EticAIWidgetLoader.iframeMode = true;
        createIframeWidget(config);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function createIframeWidget(config) {
    // Create iframe container
    const container = document.createElement("div");
    container.id = "etic-ai-iframe-container";
    container.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      ${config.position === "bottom-left" ? "left: 20px;" : "right: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    `;

    // Create iframe
    const iframe = document.createElement("iframe");
    const iframeUrl = config.iframeUrl || config.widgetUrl + "/iframe.html";
    const params = new URLSearchParams({
      config: btoa(JSON.stringify(config)),
      origin: window.location.origin,
    });

    iframe.src = `${iframeUrl}?${params.toString()}`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 50%;
    `;
    iframe.allow = "microphone; camera";
    iframe.sandbox =
      "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox";

    container.appendChild(iframe);
    document.body.appendChild(container);

    // Handle iframe communication
    window.addEventListener("message", function (event) {
      if (event.source === iframe.contentWindow) {
        handleIframeMessage(event.data, container, iframe);
      }
    });

    // Store references for cleanup
    window.EticAIWidgetLoader.iframeContainer = container;
    window.EticAIWidgetLoader.iframe = iframe;

    if (config.debug) {
      console.log("ETIC AI Widget loaded in iframe mode");
    }
  }

  function handleIframeMessage(data, container, iframe) {
    switch (data.type) {
      case "resize":
        if (data.expanded) {
          container.style.width = "400px";
          container.style.height = "600px";
          container.style.borderRadius = "12px";
          iframe.style.borderRadius = "12px";
        } else {
          container.style.width = "60px";
          container.style.height = "60px";
          container.style.borderRadius = "50%";
          iframe.style.borderRadius = "50%";
        }
        break;
      case "notification":
        // Handle notifications from iframe
        window.dispatchEvent(
          new CustomEvent("etic-ai-widget-message", {
            detail: { type: "notification", data: data.data },
          })
        );
        break;
    }
  }

  // Initialize the widget with enhanced error handling and validation
  function initWidget(userConfig = {}) {
    // Validate configuration
    const configErrors = validateConfig(userConfig);
    if (configErrors.length > 0) {
      const error = new Error(
        "Invalid configuration: " + configErrors.join(", ")
      );
      if (userConfig.debug) {
        console.error("ETIC AI Widget configuration errors:", configErrors);
      }
      return Promise.reject(error);
    }

    // Merge with default config
    const config = {
      ...defaultConfig,
      ...userConfig,
      sessionId: userConfig.sessionId || generateSessionId(),
      // Merge branding config
      branding: {
        ...defaultConfig.branding,
        ...(userConfig.branding || {}),
      },
      // Merge custom styles
      customStyles: {
        ...defaultConfig.customStyles,
        ...(userConfig.customStyles || {}),
      },
    };

    // Validate origin if specified
    if (
      config.allowedOrigins &&
      !isOriginAllowed(config.allowedOrigins, window.location.origin)
    ) {
      const error = new Error("Origin not allowed: " + window.location.origin);
      if (config.debug) {
        console.warn(
          "ETIC AI Widget: Origin not allowed:",
          window.location.origin
        );
        console.warn("Allowed origins:", config.allowedOrigins);
      }
      return Promise.reject(error);
    }

    window.EticAIWidgetLoader.config = config;

    if (config.debug) {
      console.log("ETIC AI Widget: Initializing with config:", config);
    }

    return loadWidget(config)
      .then(() => {
        if (window.EticAIWidget && !window.EticAIWidgetLoader.iframeMode) {
          window.EticAIWidgetLoader.widget = new window.EticAIWidget(config);
          window.EticAIWidgetLoader.widget.init();

          // Set up PostMessage communication
          setupPostMessageAPI();

          if (config.debug) {
            console.log(
              "ETIC AI Widget initialized successfully in script mode"
            );
          }
          return window.EticAIWidgetLoader.widget;
        } else if (window.EticAIWidgetLoader.iframeMode) {
          if (config.debug) {
            console.log(
              "ETIC AI Widget initialized successfully in iframe mode"
            );
          }
          return { mode: "iframe" };
        } else {
          throw new Error("ETIC AI Widget class not found");
        }
      })
      .catch((error) => {
        if (config.debug) {
          console.error("Failed to initialize ETIC AI Widget:", error);
        }

        // Retry logic
        if (
          window.EticAIWidgetLoader.retryCount <
          window.EticAIWidgetLoader.maxRetries
        ) {
          window.EticAIWidgetLoader.retryCount++;
          if (config.debug) {
            console.log(
              `Retrying widget initialization (${window.EticAIWidgetLoader.retryCount}/${window.EticAIWidgetLoader.maxRetries})`
            );
          }
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(initWidget(userConfig));
            }, 1000 * window.EticAIWidgetLoader.retryCount);
          });
        }

        throw error;
      });
  }

  // Set up PostMessage API for cross-origin communication
  function setupPostMessageAPI() {
    window.addEventListener("message", function (event) {
      // Only handle messages intended for the widget
      if (!event.data || event.data.target !== "etic-ai-widget") {
        return;
      }

      const widget = window.EticAIWidgetLoader.widget;
      if (!widget) {
        return;
      }

      switch (event.data.type) {
        case "open":
          // Widget will handle this internally
          break;
        case "close":
          // Widget will handle this internally
          break;
        case "updateConfig":
          if (event.data.config) {
            widget.updateConfig(event.data.config);
          }
          break;
        case "destroy":
          widget.destroy();
          window.EticAIWidgetLoader.widget = null;
          break;
        default:
          console.warn("Unknown widget message type:", event.data.type);
      }
    });

    // Listen for widget events and forward to parent if in iframe
    window.addEventListener("etic-ai-widget-message", function (event) {
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            source: "etic-ai-widget",
            type: event.detail.type,
            data: event.detail.data,
          },
          "*"
        );
      }
    });
  }

  // Destroy the widget with cleanup
  function destroyWidget() {
    if (window.EticAIWidgetLoader.widget) {
      window.EticAIWidgetLoader.widget.destroy();
      window.EticAIWidgetLoader.widget = null;
    }

    // Clean up iframe mode
    if (window.EticAIWidgetLoader.iframeMode) {
      if (window.EticAIWidgetLoader.iframeContainer) {
        document.body.removeChild(window.EticAIWidgetLoader.iframeContainer);
        window.EticAIWidgetLoader.iframeContainer = null;
      }
      if (window.EticAIWidgetLoader.iframe) {
        window.EticAIWidgetLoader.iframe = null;
      }
      window.EticAIWidgetLoader.iframeMode = false;
    }

    // Reset state
    window.EticAIWidgetLoader.loaded = false;
    window.EticAIWidgetLoader.retryCount = 0;

    if (window.EticAIWidgetLoader.config?.debug) {
      console.log("ETIC AI Widget destroyed and cleaned up");
    }
  }

  // Enhanced Public API
  window.EticAI = window.EticAI || {};

  // Core methods
  window.EticAI.init = initWidget;
  window.EticAI.destroy = destroyWidget;

  // Configuration management
  window.EticAI.updateConfig = function (newConfig) {
    const currentConfig = window.EticAIWidgetLoader.config;
    if (!currentConfig) {
      console.warn(
        "ETIC AI Widget: Cannot update config - widget not initialized"
      );
      return;
    }

    const mergedConfig = { ...currentConfig, ...newConfig };
    window.EticAIWidgetLoader.config = mergedConfig;

    if (
      window.EticAIWidgetLoader.widget &&
      !window.EticAIWidgetLoader.iframeMode
    ) {
      window.EticAIWidgetLoader.widget.updateConfig(mergedConfig);
    } else if (
      window.EticAIWidgetLoader.iframeMode &&
      window.EticAIWidgetLoader.iframe
    ) {
      // Send config update to iframe
      window.EticAIWidgetLoader.iframe.contentWindow.postMessage(
        {
          type: "updateConfig",
          config: mergedConfig,
        },
        "*"
      );
    }
  };

  // Utility methods
  window.EticAI.getConfig = function () {
    return window.EticAIWidgetLoader.config
      ? { ...window.EticAIWidgetLoader.config }
      : null;
  };

  window.EticAI.getStatus = function () {
    return {
      loaded: window.EticAIWidgetLoader.loaded,
      mode: window.EticAIWidgetLoader.iframeMode ? "iframe" : "script",
      version: window.EticAIWidgetLoader.version,
      retryCount: window.EticAIWidgetLoader.retryCount,
    };
  };

  window.EticAI.isSupported = function () {
    // Check for basic browser support
    return !!(
      window.postMessage &&
      window.addEventListener &&
      document.createElement &&
      document.body &&
      document.head
    );
  };

  // Widget control methods
  window.EticAI.open = function () {
    if (window.EticAIWidgetLoader.widget) {
      // Widget handles opening internally
      window.dispatchEvent(new CustomEvent("etic-ai-widget-open"));
    } else if (
      window.EticAIWidgetLoader.iframeMode &&
      window.EticAIWidgetLoader.iframe
    ) {
      window.EticAIWidgetLoader.iframe.contentWindow.postMessage(
        { type: "open" },
        "*"
      );
    }
  };

  window.EticAI.close = function () {
    if (window.EticAIWidgetLoader.widget) {
      // Widget handles closing internally
      window.dispatchEvent(new CustomEvent("etic-ai-widget-close"));
    } else if (
      window.EticAIWidgetLoader.iframeMode &&
      window.EticAIWidgetLoader.iframe
    ) {
      window.EticAIWidgetLoader.iframe.contentWindow.postMessage(
        { type: "close" },
        "*"
      );
    }
  };

  window.EticAI.toggle = function () {
    // This would need to be implemented in the widget itself
    if (window.EticAIWidgetLoader.widget) {
      window.dispatchEvent(new CustomEvent("etic-ai-widget-toggle"));
    } else if (
      window.EticAIWidgetLoader.iframeMode &&
      window.EticAIWidgetLoader.iframe
    ) {
      window.EticAIWidgetLoader.iframe.contentWindow.postMessage(
        { type: "toggle" },
        "*"
      );
    }
  };

  // Auto-initialize if config is already present
  if (window.EticAI && window.EticAI.config) {
    initWidget(window.EticAI.config).catch(console.error);
  }

  // Support for legacy initialization
  if (window.EticAIConfig) {
    initWidget(window.EticAIConfig).catch(console.error);
  }
})();
