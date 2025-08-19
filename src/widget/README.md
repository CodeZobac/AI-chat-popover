# ETIC AI Embeddable Widget

This directory contains the standalone, embeddable version of the ETIC AI chatbot widget that can be integrated into any website.

## Features

- **Shadow DOM Encapsulation**: Styles are completely isolated from the host website
- **Cross-Origin Support**: Works on any domain with proper configuration
- **PostMessage API**: Secure communication between domains
- **Responsive Design**: Adapts to mobile and desktop screens
- **Lightweight**: Minimal impact on page load performance
- **Customizable**: Theme, colors, and positioning options

## Files

- `index.ts` - Main entry point for the widget bundle
- `widget.tsx` - Core widget class with Shadow DOM implementation
- `types.ts` - TypeScript interfaces and types
- `components/StandaloneChatWidget.tsx` - React component for the chat interface
- `styles.css` - Widget-specific CSS styles
- `loader.js` - Lightweight loader script for easy integration
- `demo.html` - Demo page showing integration examples

## Building

```bash
# Build the widget bundle
npm run build:widget

# Build in development mode with watch
npm run build:widget:dev

# Build both Next.js app and widget
npm run build:all
```

## Integration

### Basic Integration

Add this code before the closing `</body>` tag:

```html
<script>
  window.EticAI = {
    config: {
      theme: 'light',
      position: 'bottom-right',
      primaryColor: '#2563eb'
    }
  };
</script>
<script src="https://your-domain.com/widget/etic-ai-widget.js" async></script>
```

### Advanced Configuration

```html
<script>
  window.EticAI = {
    config: {
      apiKey: 'your-api-key', // Optional
      apiEndpoint: 'https://your-api.com/chat',
      theme: 'light', // 'light' or 'dark'
      position: 'bottom-right', // 'bottom-right' or 'bottom-left'
      primaryColor: '#2563eb', // Custom brand color
      allowedOrigins: ['https://yourdomain.com'], // Security
      autoOpen: false, // Auto-open on load
      showWelcomeMessage: true, // Show welcome message
      sessionId: 'custom-session-id' // Optional custom session ID
    }
  };
</script>
<script src="https://your-domain.com/widget/etic-ai-widget.js" async></script>
```

### Using the Loader Script

For better performance and automatic updates:

```html
<script>
  window.EticAI = {
    config: {
      // your configuration
    }
  };
</script>
<script src="https://your-domain.com/widget/loader.js" async></script>
```

## API Methods

Once loaded, you can control the widget programmatically:

```javascript
// Initialize the widget
EticAI.init({
  theme: 'dark',
  position: 'bottom-left'
});

// Update configuration
EticAI.updateConfig({
  primaryColor: '#10b981'
});

// Destroy the widget
EticAI.destroy();
```

## Events

Listen for widget events:

```javascript
window.addEventListener('etic-ai-widget-message', function(event) {
  console.log('Widget event:', event.detail.type, event.detail.data);
});
```

Available events:
- `widget-opened` - Widget was opened
- `widget-closed` - Widget was closed
- `message` - New message received

## Security

### Origin Validation

Configure allowed origins for security:

```javascript
window.EticAI = {
  config: {
    allowedOrigins: [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
      '*.yourdomain.com' // Wildcard subdomain support
    ]
  }
};
```

### API Key Authentication

If your API requires authentication:

```javascript
window.EticAI = {
  config: {
    apiKey: 'your-secret-api-key',
    apiEndpoint: 'https://your-secure-api.com/chat'
  }
};
```

## Customization

### Themes

Built-in themes:
- `light` - Light theme with blue accents
- `dark` - Dark theme with gray tones

### Custom Colors

Override the primary color:

```javascript
window.EticAI = {
  config: {
    primaryColor: '#your-brand-color'
  }
};
```

### Positioning

Available positions:
- `bottom-right` - Bottom right corner (default)
- `bottom-left` - Bottom left corner

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Bundle Size

- Main bundle: ~187KB (minified)
- Loader script: ~5KB (minified)
- Gzipped: ~60KB

## Development

### Local Testing

1. Build the widget: `npm run build:widget`
2. Open `dist/widget/test.html` in a browser
3. Test the widget functionality

### Debugging

Enable debug mode:

```javascript
window.EticAI = {
  config: {
    debug: true
  }
};
```

This will log additional information to the browser console.

## Deployment

1. Build the widget bundle
2. Upload `dist/widget/` contents to your CDN
3. Update the script src URLs in your integration code
4. Test on your target websites

## Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify script URLs are accessible
3. Check CORS configuration
4. Ensure allowed origins are configured correctly

### Styling Issues

1. Verify Shadow DOM is supported
2. Check for CSS conflicts (shouldn't happen with Shadow DOM)
3. Test in different browsers

### API Issues

1. Verify API endpoint is accessible
2. Check CORS headers on your API
3. Verify API key authentication if used
4. Test API endpoint directly

## License

This widget is part of the ETIC AI Chatbot project.