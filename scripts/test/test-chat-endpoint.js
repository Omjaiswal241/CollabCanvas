// Simple test to check if chat endpoint works
async function testChatEndpoint() {
  const HTTP_BACKEND = 'http://localhost:3001';
  
  console.log('Testing chat retrieval endpoint...\n');
  
  // Get a list of rooms first
  console.log('1. Fetching room info...');
  const roomResponse = await fetch(`${HTTP_BACKEND}/room/chat-test-room`);
  const roomData = await roomResponse.json();
  
  if (roomData.room) {
    console.log(`✓ Found room: ${roomData.room.slug} (ID: ${roomData.room.id})`);
    const roomId = roomData.room.id;
    
    // Get chats for this room
    console.log('\n2. Fetching chats for room...');
    const chatsResponse = await fetch(`${HTTP_BACKEND}/chats/${roomId}`);
    const chatsData = await chatsResponse.json();
    
    console.log(`Found ${chatsData.messages?.length || 0} chat messages\n`);
    
    if (chatsData.messages && chatsData.messages.length > 0) {
      chatsData.messages.forEach((msg, index) => {
        console.log(`Message ${index + 1}:`);
        console.log(`  ID: ${msg.id}`);
        console.log(`  User: ${msg.user?.name || 'Unknown'} (${msg.userId})`);
        console.log(`  Message: ${msg.message}`);
        console.log(`  Created: ${msg.createdAt}`);
        console.log('');
      });
      
      console.log('✓ Chat retrieval endpoint is working!');
    } else {
      console.log('No chat messages in this room yet.');
      console.log('You can test by:');
      console.log('1. Opening http://localhost:8080');
      console.log('2. Signing in');
      console.log('3. Creating/joining a room');
      console.log('4. Opening the chat panel');
      console.log('5. Sending a message');
    }
  } else {
    console.log('Room not found. Creating a test...');
  }
}

testChatEndpoint().catch(console.error);
