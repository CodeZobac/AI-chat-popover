// Test script for scheduling API endpoints
// Run with: node test-scheduling-api.js

const BASE_URL = 'http://localhost:3000';

async function testInterviewScheduling() {
  console.log('Testing Interview Scheduling API...');
  
  const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+351123456789',
    programInterest: 'Web Development',
    format: 'video',
    preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    timePreference: 'morning',
    notes: 'Looking forward to learning more about the program'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/scheduling/interview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': 'test-session-' + Date.now()
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Interview API Response:', result);
    
    if (result.success) {
      console.log('✅ Interview scheduling successful');
      console.log('Reference Number:', result.data.referenceNumber);
    } else {
      console.log('❌ Interview scheduling failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Interview API Error:', error.message);
  }
  
  console.log('');
}

async function testTourScheduling() {
  console.log('Testing Tour Scheduling API...');
  
  const testData = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+351987654321',
    preferredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    timePreference: 'afternoon',
    groupSize: 3,
    specialRequirements: 'Wheelchair accessible',
    notes: 'Interested in the facilities and labs'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/scheduling/tour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': 'test-session-' + Date.now()
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Tour API Response:', result);
    
    if (result.success) {
      console.log('✅ Tour scheduling successful');
      console.log('Reference Number:', result.data.referenceNumber);
    } else {
      console.log('❌ Tour scheduling failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Tour API Error:', error.message);
  }
  
  console.log('');
}

async function testCallScheduling() {
  console.log('Testing Call Scheduling API...');
  
  const testData = {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+351555123456',
    preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    timePreference: 'specific',
    specificTime: '14:00',
    callPurpose: 'Discuss program requirements and career opportunities',
    timezone: 'Europe/Lisbon',
    notes: 'Prefer to discuss technical aspects of the curriculum'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/scheduling/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': 'test-session-' + Date.now()
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Call API Response:', result);
    
    if (result.success) {
      console.log('✅ Call scheduling successful');
      console.log('Reference Number:', result.data.referenceNumber);
    } else {
      console.log('❌ Call scheduling failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Call API Error:', error.message);
  }
  
  console.log('');
}

async function testCallAvailability() {
  console.log('Testing Call Availability API...');
  
  const testDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  try {
    const response = await fetch(`${BASE_URL}/api/scheduling/call?date=${testDate}&timezone=Europe/Lisbon`);
    const result = await response.json();
    
    console.log('Availability API Response:', result);
    
    if (result.availableSlots) {
      console.log('✅ Availability check successful');
      console.log('Available slots:', result.availableSlots);
      console.log('Booked slots:', result.bookedSlots);
    } else {
      console.log('❌ Availability check failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Availability API Error:', error.message);
  }
  
  console.log('');
}

async function runTests() {
  console.log('🧪 Starting Scheduling API Tests\n');
  console.log('Make sure the Next.js development server is running on http://localhost:3000\n');
  
  await testInterviewScheduling();
  await testTourScheduling();
  await testCallScheduling();
  await testCallAvailability();
  
  console.log('🏁 All tests completed!');
}

// Run the tests
runTests().catch(console.error);