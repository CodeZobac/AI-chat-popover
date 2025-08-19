/**
 * ETIC AI Widget - Simple Integration Snippet
 * 
 * This is the simplest way to add the ETIC AI chatbot to your website.
 * Just copy and paste this code before the closing </body> tag.
 * 
 * Customize the configuration object below to match your needs.
 */

(function() {
  'use strict';
  
  // Configuration - Customize these values
  const WIDGET_CONFIG = {
    // Basic settings
    theme: 'light',                    // 'light' or 'dark'
    position: 'bottom-right',          // 'bottom-right' or 'bottom-left'
    primaryColor: '#2563eb',           // Your brand color
    
    // Security (recommended for production)
    allowedOrigins: ['*'],             // Replace with your domain(s): ['https://yourdomain.com']
    
    // Behavior
    autoOpen: false,                   // Auto-open widget on page load
    showWelcomeMessage: true,          // Show welcome message when opened
    
    // Branding (optional)
    branding: {
      name: 'ETIC AI',                 // Widget name
      showPoweredBy: true,             // Show "Powered by ETIC AI"
    },
    
    // Advanced (optional)
    debug: false,                      // Enable debug logging
    fallbackToIframe: true,            // Use iframe fallback if script fails
  };
  
  // Widget URL - Change this to your widget hosting URL
  const WIDGET_URL = 'https://etic-ai.vercel.app/widget';
  
  // Don't modify below this line unless you know what you're doing
  // ================================================================
  
  // Set up global configuration
  window.EticAI = window.EticAI || {};
  window.EticAI.config = {
    ...WIDGET_CONFIG,
    widgetUrl: WIDGET_URL,
  };
  
  // Load the widget loader
  const script = document.createElement('script');
  script.src = WIDGET_URL + '/loader.js';
  script.async = true;
  script.defer = true;
  
  // Handle load success
  script.onload = function() {
    console.log('ETIC AI Widget loaded successfully');
  };
  
  // Handle load error
  script.onerror = function() {
    console.error('Failed to load ETIC AI Widget');
  };
  
  // Add to page
  (document.head || document.body).appendChild(script);
  
})();