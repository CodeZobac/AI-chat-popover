# ETIC AI Widget Integration Guide

This guide provides comprehensive instructions for integrating the ETIC AI chatbot widget into your website.

## Quick Start

### Option 1: Simple Integration Snippet (Recommended)

Copy and paste this code before the closing `</body>` tag:

```html
<script>
  window.EticAI = {
    config: {
      theme: 'light',
      position: 'bottom-right',
      primaryColor: '#2563eb',
      allowedOrigins: ['https://yourdomain.com'] // Replace with your domain
    }
  };
</script>
<script src="https://etic-ai.vercel.app/widget/loader.js" async></script>
```

### Option 2: Using the Integration Snippet

Download and customize the integration snippet:

```html
<script src="https://etic-ai.vercel.app/widget/integration-snippet.js"></script>
```

## Configuration Options

### Basic Configuration

```javascript
window.EticAI = {
  config: {
    // Appearance
    theme: 'light',                    // 'light' or 'dark'
    position: 'bottom-right',          // 'bottom-right' or 'bottom-left'
    primaryColor: '#2563eb',           // Your brand color (hex)
    secondaryColor: '#f3f4f6',         // Secondary color (hex)
    textColor: '#374151',              // Text color (hex)
    
    // Behavior
    autoOpen: false,                   // Auto-open widget on page load
    showWelcomeMessage: true,          // Show welcome message when opened
    
    // Security
    allowedOrigins: ['*'],             // Allowed origins (use specific domains in production)
    
    // API
    apiEndpoint: 'https://your-api.com/chat', // Your chat API endpoint
    apiKey: 'your-api-key',            // Optional API key
    
    // Session
    sessionId: null,                   // Custom session ID (auto-generated if not provided)
    
    // Advanced
    debug: false,                      // Enable debug logging
    fallbackToIframe: true,            // Use iframe fallback if script fails
  }
};
```

### Branding Configuration

```javascript
window.EticAI = {
  config: {
    branding: {
      name: 'Your AI Assistant',        // Widget name
      logo: 'https://your-site.com/logo.png', // Logo URL (optional)
      showPoweredBy: false,            // Hide "Powered by ETIC AI"
    }
  }
};
```

### Custom Styles

```javascript
window.EticAI = {
  config: {
    customStyles: {
      '--widget-border-radius': '16px',
      '--widget-shadow': '0 10px 40px rgba(0,0,0,0.1)',
      '--message-border-radius': '12px',
      '--font-family': 'Inter, sans-serif',
    }
  }
};
```

## Security Configuration

### Origin Validation

For production environments, always specify allowed origins:

```javascript
window.EticAI = {
  config: {
    allowedOrigins: [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
      'https://subdomain.yourdomain.com',
      '*.yourdomain.com'  // Wildcard for all subdomains
    ]
  }
};
```

### API Authentication

If your API requires authentication:

```javascript
window.EticAI = {
  config: {
    apiKey: 'your-secret-api-key',
    apiEndpoint: 'https://your-secure-api.com/chat',
    // Additional headers can be configured in the widget
  }
};
```

## Advanced Integration

### Programmatic Control

Once the widget is loaded, you can control it programmatically:

```javascript
// Initialize the widget
EticAI.init({
  theme: 'dark',
  position: 'bottom-left'
});

// Open the widget
EticAI.open();

// Close the widget
EticAI.close();

// Toggle the widget
EticAI.toggle();

// Update configuration
EticAI.updateConfig({
  primaryColor: '#10b981',
  theme: 'dark'
});

// Get current configuration
const config = EticAI.getConfig();

// Get widget status
const status = EticAI.getStatus();

// Check browser support
if (EticAI.isSupported()) {
  // Widget is supported
}

// Destroy the widget
EticAI.destroy();
```

### Event Handling

Listen for widget events:

```javascript
window.addEventListener('etic-ai-widget-message', function(event) {
  const { type, data } = event.detail;
  
  switch (type) {
    case 'widget-opened':
      console.log('Widget was opened');
      break;
    case 'widget-closed':
      console.log('Widget was closed');
      break;
    case 'message':
      console.log('New message:', data);
      break;
    case 'notification':
      console.log('Widget notification:', data);
      break;
  }
});
```

### Custom Event Triggers

Trigger widget actions from your website:

```javascript
// Open widget when user clicks a button
document.getElementById('help-button').addEventListener('click', function() {
  EticAI.open();
});

// Auto-open widget after 30 seconds
setTimeout(function() {
  EticAI.open();
}, 30000);

// Open widget when user scrolls to bottom
window.addEventListener('scroll', function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    EticAI.open();
  }
});
```

## Fallback and Compatibility

### Iframe Fallback

The widget automatically falls back to iframe mode if the main script fails to load:

```javascript
window.EticAI = {
  config: {
    fallbackToIframe: true,           // Enable iframe fallback (default: true)
    iframeUrl: 'https://your-domain.com/widget/iframe.html', // Custom iframe URL
  }
};
```

### Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Fallback Support**: IE 11+ (with iframe mode)

### Feature Detection

```javascript
// Check if the widget loaded successfully
window.addEventListener('load', function() {
  setTimeout(function() {
    const status = EticAI.getStatus();
    if (status.loaded) {
      console.log('Widget loaded in', status.mode, 'mode');
    } else {
      console.log('Widget failed to load');
      // Implement fallback behavior
    }
  }, 2000);
});
```

## Content Security Policy (CSP)

If your site uses CSP, add these directives:

```
script-src 'self' https://etic-ai.vercel.app;
connect-src 'self' https://etic-ai.vercel.app;
frame-src https://etic-ai.vercel.app;
style-src 'self' 'unsafe-inline';
```

## Performance Optimization

### Lazy Loading

Load the widget only when needed:

```javascript
// Load widget when user shows intent to interact
let widgetLoaded = false;

function loadWidget() {
  if (widgetLoaded) return;
  widgetLoaded = true;
  
  const script = document.createElement('script');
  script.src = 'https://etic-ai.vercel.app/widget/loader.js';
  script.async = true;
  document.head.appendChild(script);
}

// Trigger on user interaction
document.addEventListener('mousemove', loadWidget, { once: true });
document.addEventListener('scroll', loadWidget, { once: true });
document.addEventListener('click', loadWidget, { once: true });
```

### Preloading

Preload the widget for faster initialization:

```html
<link rel="preload" href="https://etic-ai.vercel.app/widget/loader.js" as="script">
<link rel="preload" href="https://etic-ai.vercel.app/widget/etic-ai-widget.js" as="script">
```

## Testing and Debugging

### Debug Mode

Enable debug mode for development:

```javascript
window.EticAI = {
  config: {
    debug: true,  // Enables console logging
  }
};
```

### Testing Integration

1. **Local Testing**: Use the demo HTML file
2. **Staging**: Test with your staging domain in `allowedOrigins`
3. **Production**: Use specific domains, never use `['*']` in production

### Common Issues

#### Widget Not Loading
- Check browser console for errors
- Verify script URLs are accessible
- Check CORS configuration
- Ensure allowed origins are configured correctly

#### Styling Issues
- The widget uses Shadow DOM for style isolation
- Custom styles should be applied through the `customStyles` config
- Check for CSP restrictions

#### API Issues
- Verify API endpoint is accessible
- Check CORS headers on your API
- Test API endpoint directly
- Verify API key authentication if used

## Migration Guide

### From Version 1.0 to 1.1

```javascript
// Old configuration
window.EticAIConfig = {
  theme: 'light',
  position: 'bottom-right'
};

// New configuration
window.EticAI = {
  config: {
    theme: 'light',
    position: 'bottom-right'
  }
};
```

## Examples

### E-commerce Site

```javascript
window.EticAI = {
  config: {
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#059669', // Green theme
    branding: {
      name: 'Shopping Assistant',
      showPoweredBy: false,
    },
    autoOpen: false,
    showWelcomeMessage: true,
    allowedOrigins: ['https://mystore.com', 'https://www.mystore.com'],
  }
};
```

### Educational Institution

```javascript
window.EticAI = {
  config: {
    theme: 'light',
    position: 'bottom-left',
    primaryColor: '#2563eb', // Blue theme
    branding: {
      name: 'Academic Advisor',
      logo: '/images/school-logo.png',
    },
    showWelcomeMessage: true,
    allowedOrigins: ['https://university.edu', '*.university.edu'],
  }
};
```

### SaaS Application

```javascript
window.EticAI = {
  config: {
    theme: 'dark',
    position: 'bottom-right',
    primaryColor: '#7c3aed', // Purple theme
    branding: {
      name: 'Support Assistant',
      showPoweredBy: false,
    },
    autoOpen: false,
    apiKey: 'your-saas-api-key',
    allowedOrigins: ['https://app.yourservice.com'],
  }
};
```

## Support

For technical support or questions:

- **Documentation**: [Widget Documentation](https://etic-ai.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@etic-ai.com

## License

This widget is part of the ETIC AI Chatbot project. See LICENSE file for details.