#!/usr/bin/env node

/**
 * Simple HTTP server for testing the ETIC AI Widget locally
 * 
 * Usage:
 *   node serve-widget.js [port]
 * 
 * Default port: 3001
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 3001;
const WIDGET_DIR = path.join(__dirname, '../../dist/widget');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown',
  '.txt': 'text/plain'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, { 
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

function serveDirectory(res, dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>ETIC AI Widget Files</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; }
        h1 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { margin: 0.5rem 0; }
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .file { padding: 0.5rem; background: #f9f9f9; border-radius: 4px; }
        .description { color: #666; font-size: 0.9rem; margin-left: 1rem; }
    </style>
</head>
<body>
    <h1>🤖 ETIC AI Widget Files</h1>
    <p>Widget server running on port ${PORT}</p>
    <ul>
        ${files.map(file => {
          const descriptions = {
            'demo.html': 'Interactive demo page',
            'test-integration.html': 'Comprehensive integration test suite',
            'iframe.html': 'Iframe fallback version',
            'loader.js': 'Main loader script for integration',
            'integration-snippet.js': 'Simple integration snippet',
            'etic-ai-widget.js': 'Main widget bundle',
            'README.md': 'Widget documentation',
            'INTEGRATION_GUIDE.md': 'Comprehensive integration guide'
          };
          
          return `
            <li class="file">
                <a href="/${file}">${file}</a>
                ${descriptions[file] ? `<div class="description">${descriptions[file]}</div>` : ''}
            </li>
          `;
        }).join('')}
    </ul>
    
    <h2>Quick Test</h2>
    <p>To test the widget integration, open <a href="/demo.html">demo.html</a> or <a href="/test-integration.html">test-integration.html</a></p>
    
    <h2>Integration</h2>
    <p>Use this URL in your integration:</p>
    <code>http://localhost:${PORT}/loader.js</code>
</body>
</html>
    `;

    res.writeHead(200, { 
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(html);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Remove leading slash and decode
  pathname = decodeURIComponent(pathname.slice(1));

  // Default to directory listing
  if (pathname === '' || pathname === '/') {
    serveDirectory(res, WIDGET_DIR);
    return;
  }

  const filePath = path.join(WIDGET_DIR, pathname);

  // Security check - ensure file is within widget directory
  if (!filePath.startsWith(WIDGET_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    if (stats.isDirectory()) {
      serveDirectory(res, filePath);
    } else {
      serveFile(res, filePath);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 ETIC AI Widget server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${WIDGET_DIR}`);
  console.log(`🧪 Test the widget at: http://localhost:${PORT}/demo.html`);
  console.log(`🔧 Integration tests at: http://localhost:${PORT}/test-integration.html`);
  console.log(`📖 Documentation at: http://localhost:${PORT}/README.md`);
  console.log('\nPress Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down widget server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down widget server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});