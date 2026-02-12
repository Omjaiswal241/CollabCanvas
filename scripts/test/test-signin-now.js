// Quick test of signin endpoint
async function testSignin() {
  const HTTP_BACKEND = 'http://localhost:3001';
  
  console.log('Testing signin endpoint...\n');
  
  try {
    const response = await fetch(`${HTTP_BACKEND}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok && data.token) {
      console.log('\n✅ Signin is WORKING!');
      console.log('Token received:', data.token.substring(0, 30) + '...');
    } else {
      console.log('\n❌ Signin failed:', data.message);
    }
  } catch (error) {
    console.error('\n❌ Error connecting to backend:', error.message);
  }
}

testSignin();
