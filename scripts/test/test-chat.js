// Test chat functionality
async function testChatInsertion() {
  const HTTP_BACKEND = 'http://localhost:3001';
  const WS_URL = 'ws://localhost:8080';
  
  console.log('Testing chat functionality...\n');
  
  // Step 1: Sign in to get a token
  console.log('1. Signing in...');
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
  
  console.log('✓ Signed in successfully');
  const token = signinData.token;
  
  // Step 2: Create a test room
  console.log('\n2. Creating a test room...');
  const roomResponse = await fetch(`${HTTP_BACKEND}/room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({
      name: 'chat-test-room'
    })
  });
  
  const roomData = await roomResponse.json();
  
  if (!roomData.roomId) {
    console.log('✗ Failed to create room');
    console.log(roomData);
    return;
  }
  
  console.log(`✓ Room created with ID: ${roomData.roomId}`);
  const roomId = roomData.roomId;
  
  // Step 3: Connect to WebSocket and send a chat message
  console.log('\n3. Connecting to WebSocket...');
  
  const ws = new (await import('ws')).WebSocket(`${WS_URL}?token=${token}`);
  
  await new Promise((resolve, reject) => {
    ws.on('open', () => {
      console.log('✓ WebSocket connected');
      
      // Join the room
      ws.send(JSON.stringify({
        type: 'join_room',
        roomId: roomId.toString()
      }));
      
      console.log('\n4. Sending chat message...');
      
      // Send a chat message
      ws.send(JSON.stringify({
        type: 'chat',
        roomId: roomId.toString(),
        message: 'Hello from test! This is a chat message.'
      }));
      
      setTimeout(async () => {
        // Step 4: Verify the chat was saved to database
        console.log('\n5. Verifying chat in database...');
        
        const chatsResponse = await fetch(`${HTTP_BACKEND}/chats/${roomId}`);
        const chatsData = await chatsResponse.json();
        
        console.log('Chat messages in database:', chatsData.messages);
        
        if (chatsData.messages && chatsData.messages.length > 0) {
          console.log(`\n✓ SUCCESS! Found ${chatsData.messages.length} chat message(s) in database`);
          chatsData.messages.forEach((msg, index) => {
            console.log(`\nMessage ${index + 1}:`);
            console.log(`  ID: ${msg.id}`);
            console.log(`  User: ${msg.user?.name || 'Unknown'}`);
            console.log(`  Message: ${msg.message}`);
            console.log(`  Created: ${msg.createdAt}`);
          });
        } else {
          console.log('✗ No chat messages found in database');
        }
        
        ws.close();
        resolve();
      }, 2000);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    });
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      console.log('Received WebSocket message:', message);
    });
  });
}

testChatInsertion().catch(console.error);
