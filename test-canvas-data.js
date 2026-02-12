// Test canvas data insertion
async function testCanvasData() {
  const HTTP_BACKEND = 'http://localhost:3001';
  
  console.log('Testing canvas data retrieval...\n');
  
  // Step 0: Sign in to get token
  console.log('0. Signing in to get token...');
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
  
  if (!signinData.token) {
    console.log('✗ Failed to sign in');
    return;
  }
  
  console.log('✓ Signed in successfully\n');
  const token = signinData.token;
  
  // Step 1: Get room info
  console.log('1. Fetching room info...');
  const roomResponse = await fetch(`${HTTP_BACKEND}/room/chat-test-room`);
  const roomData = await roomResponse.json();
  
  if (roomData.room) {
    console.log(`✓ Found room: ${roomData.room.slug} (ID: ${roomData.room.id})`);
    const roomId = roomData.room.id;
    
    // Step 2: Get canvas data for this room
    console.log('\n2. Fetching canvas data for room...');
    const canvasResponse = await fetch(`${HTTP_BACKEND}/canvas/${roomId}`, {
      headers: {
        'Authorization': token
      }
    });
    
    if (canvasResponse.ok) {
      const canvasData = await canvasResponse.json();
      
      console.log(`Found ${canvasData.canvasData?.length || 0} canvas entries\n`);
      
      if (canvasData.canvasData && canvasData.canvasData.length > 0) {
        canvasData.canvasData.slice(0, 5).forEach((entry, index) => {
          console.log(`Entry ${index + 1}:`);
          console.log(`  ID: ${entry.id}`);
          console.log(`  Type: ${entry.type}`);
          console.log(`  User: ${entry.userId}`);
          console.log(`  Data: ${entry.data.substring(0, 50)}...`);
          console.log(`  Created: ${entry.createdAt}`);
          console.log('');
        });
        
        if (canvasData.canvasData.length > 5) {
          console.log(`... and ${canvasData.canvasData.length - 5} more entries`);
        }
        
        console.log('✓ Canvas data retrieval endpoint is working!');
      } else {
        console.log('No canvas data in this room yet.');
        console.log('\nPossible issues:');
        console.log('1. WebSocket backend might not be saving data');
        console.log('2. Draw operations might not be sending correct messages');
        console.log('3. Check WebSocket backend logs for errors');
      }
    } else {
      console.log(`✗ Canvas endpoint returned status: ${canvasResponse.status}`);
      const errorData = await canvasResponse.json().catch(() => ({}));
      console.log('Error:', errorData);
    }
  } else {
    console.log('Room not found.');
  }
}

testCanvasData().catch(console.error);
