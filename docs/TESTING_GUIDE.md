# Quick Testing Guide 🧪

This guide will help you verify all backend integrations are working correctly.

## Prerequisites

- All services running:
  - Frontend: `http://localhost:5173`
  - HTTP Backend: `http://localhost:3001`
  - WebSocket: `ws://localhost:8080`
- PostgreSQL database running and migrated

## Test Checklist

### ✅ 1. Authentication Flow

#### Sign Up
1. Navigate to `http://localhost:5173`
2. Click **"Start Drawing"** or **"Get Started"**
3. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Create Account"**
5. **Expected**: 
   - Success toast notification
   - Automatic redirect to `/rooms` page
   - Token stored in localStorage (check DevTools → Application → Local Storage)

#### Sign In
1. If already logged in, logout first
2. Navigate to `http://localhost:5173/signin`
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Sign In"**
5. **Expected**:
   - Success toast notification
   - Redirect to `/rooms`
   - Token in localStorage

#### Logout
1. Click **"Logout"** in Navbar or Rooms page
2. **Expected**:
   - Success toast
   - Redirect to home page
   - Token removed from localStorage
   - Navbar shows "Sign In" / "Get Started"

---

### ✅ 2. Room Management

#### Create Room
1. Sign in and go to `/rooms`
2. Enter room name: `test-room-123`
3. Click **"Create Room"**
4. **Expected**:
   - Success toast
   - Redirect to `/canvas/:roomId`
   - Canvas loads with black background

#### Join Existing Room
1. Go to `/rooms`
2. In "Join Existing Room" section
3. Enter: `test-room-123`
4. Click **"Join Room"**
5. **Expected**:
   - Success toast
   - Redirect to canvas page

#### Quick Start
1. Go to `/rooms`
2. Click **"Quick Start - Create Random Room"**
3. **Expected**:
   - Room created with name like `room-1707755873000`
   - Immediate redirect to canvas

---

### ✅ 3. Drawing Tools

#### Pencil Tool
1. In canvas, select **Pencil** (first icon)
2. Click and drag on canvas
3. **Expected**: White free-hand line follows mouse

#### Rectangle Tool
1. Select **Rectangle** (second icon)
2. Click and drag diagonally
3. **Expected**: White rectangle appears

#### Circle Tool
1. Select **Circle** (third icon)
2. Click and drag
3. **Expected**: White circle appears

#### Eraser Tool
1. Select **Eraser** (fourth icon)
2. Hover over existing shapes
3. **Expected**: Shape highlights in red
4. Click on highlighted shape
5. **Expected**: Shape disappears

#### Text Tool
1. Select **Text** (fifth icon)
2. Click anywhere on canvas
3. Enter text in prompt
4. Click OK
5. **Expected**: Text appears at click location

---

### ✅ 4. Real-time Collaboration

#### Test Multi-user Sync
1. Open canvas room in **Browser 1**
2. Copy the URL (e.g., `http://localhost:5173/canvas/1`)
3. Open same URL in **Browser 2** (or incognito window)
4. In Browser 1, draw a circle
5. **Expected**: Circle appears in Browser 2 instantly
6. In Browser 2, draw a rectangle
7. **Expected**: Rectangle appears in Browser 1 instantly
8. Delete shape in Browser 1
9. **Expected**: Shape disappears in Browser 2

#### Check WebSocket Messages
1. Open DevTools → Network tab → WS filter
2. Click on the WebSocket connection
3. Draw something
4. **Expected**: See messages like:
```json
{
  "type": "chat",
  "message": "{\"shape\":{\"type\":\"circle\",...}}",
  "roomId": "1"
}
```

---

### ✅ 5. Data Persistence

#### Test Shape Persistence
1. Draw several shapes in a room
2. Close the browser tab
3. Navigate back to `/canvas/:roomId`
4. **Expected**: All previous shapes are still there

#### Verify in Database
1. Open Prisma Studio:
```bash
cd packages/db
pnpm exec prisma studio
```
2. Browse to **Chat** table
3. **Expected**: See entries with shape data in `message` field

---

### ✅ 6. Protected Routes

#### Test Authentication Guard
1. Logout if logged in
2. Try to navigate directly to `/rooms`
3. **Expected**: Redirected to `/signin`

---

### ✅ 7. Error Handling

#### Test Duplicate User
1. Try to sign up with existing email
2. **Expected**: Error toast: "User already exists with this username"

#### Test Wrong Password
1. Try to sign in with wrong password
2. **Expected**: Error toast: "Not authorized"

#### Test Non-existent Room
1. Try to join room: `room-does-not-exist-xyz`
2. **Expected**: Error toast: "Room not found"

#### Test Duplicate Room Name
1. Create room: `test-room-duplicate`
2. Try to create another room with same name
3. **Expected**: Error toast: "Room already exists with this name"

---

## 🔍 Debugging Tips

### Check Frontend Logs
Open DevTools → Console
- Look for `Game instance created`
- Look for `Setting tool to: <tool>`
- Watch WebSocket messages

### Check Backend Logs
In terminal where backend is running:
- Should see database queries
- Should see WebSocket connections
- Look for any errors

### Verify Database Connection
```bash
# Test database connection
cd packages/db
pnpm exec prisma studio
```

### Check Backend Endpoints
Test HTTP endpoints directly:

```bash
# Sign up
curl -X POST http://localhost:3001/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"pass123","name":"Test"}'

# Sign in
curl -X POST http://localhost:3001/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"pass123"}'

# Get room (replace with actual slug)
curl http://localhost:3001/room/test-room
```

---

## ✨ Success Criteria

All integrations are working if:

✅ Can sign up with new account  
✅ Can sign in with existing account  
✅ Can logout and token is removed  
✅ Can create rooms with auth token  
✅ Can join existing rooms  
✅ Can draw with all 5 tools  
✅ Shapes sync in real-time across browsers  
✅ Shapes persist after page reload  
✅ Protected routes redirect to signin  
✅ Error messages display for invalid actions  

---

## 🎉 Next Steps

Once all tests pass:
1. Invite team members to test
2. Open multiple browsers simultaneously
3. Try drawing complex scenes together
4. Test on different devices/networks
5. Consider adding automated tests

Happy Testing! 🚀
