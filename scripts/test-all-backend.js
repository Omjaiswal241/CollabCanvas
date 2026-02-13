// Comprehensive backend test script
const HTTP_BACKEND = "http://localhost:3001";

// Test credentials
const testUser = {
  name: "Test User",
  email: `test${Date.now()}@example.com`,
  password: "testPassword123"
};

let authToken = "";
let roomId = "";

async function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

async function testSignup() {
  log("🔐", "Testing Signup...");
  try {
    const response = await fetch(`${HTTP_BACKEND}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: testUser.email,
        password: testUser.password,
        name: testUser.name,
      }),
    });
    const data = await response.json();
    
    if (response.ok && data.userId) {
      log("✅", `Signup successful! User ID: ${data.userId}`);
      return true;
    } else {
      log("❌", `Signup failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    log("❌", `Signup error: ${error.message}`);
    return false;
  }
}

async function testSignin() {
  log("🔐", "Testing Signin...");
  try {
    const response = await fetch(`${HTTP_BACKEND}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: testUser.email,
        password: testUser.password,
      }),
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      authToken = data.token;
      log("✅", `Signin successful! Token received: ${data.token.substring(0, 20)}...`);
      return true;
    } else {
      log("❌", `Signin failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    log("❌", `Signin error: ${error.message}`);
    return false;
  }
}

async function testGetUserProfile() {
  log("👤", "Testing Get User Profile...");
  try {
    const response = await fetch(`${HTTP_BACKEND}/user/me`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    
    if (response.ok && data.user) {
      log("✅", `User profile retrieved: ${data.user.name} (${data.user.email})`);
      return true;
    } else {
      log("❌", `Get user profile failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    log("❌", `Get user profile error: ${error.message}`);
    return false;
  }
}

async function testCreateRoom() {
  log("🏠", "Testing Create Room...");
  try {
    const roomName = `test${Date.now().toString().slice(-6)}`;
    const response = await fetch(`${HTTP_BACKEND}/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: roomName,
      }),
    });
    const data = await response.json();
    
    if (response.ok && data.roomId) {
      roomId = data.roomId;
      log("✅", `Room created! Room ID: ${data.roomId}, Name: ${roomName}`);
      return true;
    } else {
      log("❌", `Create room failed: ${data.message}`);
      console.log(`   Debug: Room name was "${roomName}" (length: ${roomName.length})`);
      return false;
    }
  } catch (error) {
    log("❌", `Create room error: ${error.message}`);
    return false;
  }
}

async function testGetUserRooms() {
  log("🏠", "Testing Get User Rooms...");
  try {
    const response = await fetch(`${HTTP_BACKEND}/user/rooms`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    
    if (response.ok && data.rooms) {
      log("✅", `User rooms retrieved: ${data.rooms.length} room(s)`);
      data.rooms.forEach(room => {
        console.log(`   - Room: ${room.slug} (ID: ${room.id})`);
      });
      return true;
    } else {
      log("❌", `Get user rooms failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    log("❌", `Get user rooms error: ${error.message}`);
    return false;
  }
}

async function testGetChats() {
  log("💬", "Testing Get Chats...");
  try {
    const response = await fetch(`${HTTP_BACKEND}/chats/${roomId}`);
    const data = await response.json();
    
    if (response.ok && data.messages) {
      log("✅", `Chats retrieved: ${data.messages.length} message(s)`);
      return true;
    } else {
      log("❌", `Get chats failed`);
      return false;
    }
  } catch (error) {
    log("❌", `Get chats error: ${error.message}`);
    return false;
  }
}

async function testGetCanvas() {
  log("🎨", "Testing Get Canvas Data...");
  try {
    const response = await fetch(`${HTTP_BACKEND}/canvas/${roomId}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    
    if (response.ok && data.canvasData) {
      log("✅", `Canvas data retrieved: ${data.canvasData.length} drawing(s)`);
      return true;
    } else {
      log("❌", `Get canvas failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    log("❌", `Get canvas error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log("\n🚀 Starting Backend Functionality Tests...\n");
  console.log("=" .repeat(60));
  
  const results = {
    passed: 0,
    failed: 0,
  };
  
  // Test signup
  if (await testSignup()) results.passed++;
  else results.failed++;
  
  console.log("");
  
  // Test signin
  if (await testSignin()) results.passed++;
  else results.failed++;
  
  console.log("");
  
  // Test authenticated endpoints
  if (authToken) {
    if (await testGetUserProfile()) results.passed++;
    else results.failed++;
    
    console.log("");
    
    if (await testCreateRoom()) results.passed++;
    else results.failed++;
    
    console.log("");
    
    if (await testGetUserRooms()) results.passed++;
    else results.failed++;
    
    console.log("");
    
    if (roomId) {
      if (await testGetChats()) results.passed++;
      else results.failed++;
      
      console.log("");
      
      if (await testGetCanvas()) results.passed++;
      else results.failed++;
    }
  } else {
    log("⚠️", "Skipping authenticated tests - no auth token");
    results.failed += 5;
  }
  
  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Test Results: ${results.passed} passed, ${results.failed} failed\n`);
  
  if (results.failed === 0) {
    console.log("✅ All backend functionalities are working!\n");
  } else {
    console.log("❌ Some tests failed. Check the logs above.\n");
  }
}

runAllTests().catch(console.error);
