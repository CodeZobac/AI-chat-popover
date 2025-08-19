export interface WidgetConfig {
  // API Configuration
  apiKey?: string;
  apiEndpoint?: string;
  widgetUrl?: string;
  
  // Appearance
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  
  // Security
  allowedOrigins?: string[];
  
  // Behavior
  sessionId?: string;
  autoOpen?: boolean;
  showWelcomeMessage?: boolean;
  
  // Branding
  branding?: {
    name?: string;
    logo?: string;
    showPoweredBy?: boolean;
  };
  
  // Customization
  customStyles?: {
    [key: string]: string;
  };
  
  // Advanced
  debug?: boolean;
  fallbackToIframe?: boolean;
  iframeUrl?: string;
}

export interface WidgetStatus {
  loaded: boolean;
  mode: 'script' | 'iframe';
  version: string;
  retryCount: number;
}

export interface WidgetBranding {
  name?: string;
  logo?: string;
  showPoweredBy?: boolean;
}

export interface WidgetMessage {
  type: 'init' | 'open' | 'close' | 'message' | 'config';
  data?: any;
  origin?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}