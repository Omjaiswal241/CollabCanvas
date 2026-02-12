// Test signup and signin
async function testAuth() {
  const HTTP_BACKEND = 'http://localhost:3001';
  
  console.log('Testing authentication...\n');
  
  // Test 1: Signup with a new user
  console.log('1. Testing SIGNUP...');
  try {
    const signupResponse = await fetch(`${HTTP_BACKEND}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'testpass123',
        name: 'Test User'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup Response:', signupData);
    
    if (signupData.userId) {
      console.log('✓ Signup successful! User ID:', signupData.userId);
      
      // Test 2: Signin with the same credentials
      console.log('\n2. Testing SIGNIN with new credentials...');
      const signinResponse = await fetch(`${HTTP_BACKEND}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test@example.com',
          password: 'testpass123'
        })
      });
      
      const signinData = await signinResponse.json();
      console.log('Signin Response:', signinData);
      
      if (signinData.token) {
        console.log('✓ Signin successful! Token received');
        console.log('Token:', signinData.token.substring(0, 20) + '...');
      } else {
        console.log('✗ Signin failed:', signinData.message);
      }
    } else {
      console.log('✗ Signup failed:', signupData.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuth();
