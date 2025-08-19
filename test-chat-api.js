// Simple test script to verify the chat API is working
// Run with: node test-chat-api.js

const testChatAPI = async () => {
  try {
    console.log('Testing chat API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Hello, can you tell me about ETIC Algarve?'
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }

    // Check if it's a streaming response
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      console.log('Reading streaming response...');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        process.stdout.write(chunk);
      }
      
      console.log('\n\nFull response received successfully!');
    } else {
      const text = await response.text();
      console.log('Response:', text);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Run the test
testChatAPI();