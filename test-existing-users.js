// Test signin with existing credentials
async function testExistingUsers() {
  const HTTP_BACKEND = 'http://localhost:3001';
  
  console.log('Testing signin with existing users...\n');
  
  // Try some common test credentials
  const testCredentials = [
    { email: 'test@example.com', password: 'testpass123' },
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'user@test.com', password: 'password' }
  ];
  
  for (const cred of testCredentials) {
    console.log(`\nTrying: ${cred.email}`);
    try {
      const response = await fetch(`${HTTP_BACKEND}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: cred.email,
          password: cred.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        console.log(`✓ SUCCESS! Signed in as ${cred.email}`);
        console.log(`  Token: ${data.token.substring(0, 30)}...`);
      } else {
        console.log(`✗ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error(`✗ Error: ${error.message}`);
    }
  }
}

testExistingUsers();
