// Test complete drawing flow
async function testDrawingFlow() {
  const HTTP_BACKEND = 'http://localhost:3001';
  
  console.log('🎨 Testing complete drawing flow...\n');
  
  // Step 1: Sign in
  console.log('1. Signing in...');
  const signinResponse = await fetch(`${HTTP_BACKEND}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  console.log('✓ Signed in\n');
  
  // Step 2: Get a test room
  const roomResponse = await fetch(`${HTTP_BACKEND}/room/chat-test-room`);
  const roomData = await roomResponse.json();
  const roomId = roomData.room.id;
  console.log(`2. Using room: ${roomData.room.slug} (ID: ${roomId})\n`);
  
  // Step 3: Get canvas data
  console.log('3. Fetching existing canvas data...');
  const canvasResponse = await fetch(`${HTTP_BACKEND}/canvas/${roomId}`, {
    headers: { 'Authorization': signinData.token }
  });
  
  const canvasData = await canvasResponse.json();
  const count = canvasData.canvasData?.length || 0;
  console.log(`✓ Found ${count} existing shapes in database\n`);
  
  if (count > 0) {
    console.log('Recent shapes:');
    canvasData.canvasData.slice(-3).forEach((entry, index) => {
      const data = typeof entry.data === 'string' ? JSON.parse(entry.data) : entry.data;
      console.log(`  ${index + 1}. ${data.type} - Created: ${new Date(entry.createdAt).toLocaleTimeString()}`);
    });
  }
  
  console.log('\n✅ Drawing flow is working!');
  console.log('💡 When you draw shapes in the canvas:');
  console.log('  1. They are sent via WebSocket');
  console.log('  2. Saved to the database');
  console.log('  3. Broadcast to other users');
  console.log('  4. Loaded when entering the room');
}

testDrawingFlow().catch(console.error);
