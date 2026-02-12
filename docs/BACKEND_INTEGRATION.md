# Backend Integration Summary 🔌

This document details all the backend API integrations in the CollabCanvas frontend.

## ✅ Completed Integrations

### 1. Authentication System

#### **Sign Up** (`/signup` page)
- **POST** `/signup` endpoint
- **Request**: `{ username: email, password, name }`
- **Response**: `{ userId: string }`
- **Flow**:
  1. User enters name, email, password
  2. Creates account via `/signup`
  3. Auto-signs in via `/signin` to get token
  4. Stores JWT token in localStorage
  5. Redirects to `/rooms` page

#### **Sign In** (`/signin` page)
- **POST** `/signin` endpoint
- **Request**: `{ username: email, password }`
- **Response**: `{ token: string }`
- **Flow**:
  1. User enters email, password
  2. Authenticates via `/signin`
  3. Stores JWT token in localStorage
  4. Redirects to `/rooms` page

#### **Logout**
- Removes token from localStorage
- Redirects to home page
- Available in Navbar and Rooms page

---

### 2. Room Management

#### **Create Room** (`/rooms` page)
- **POST** `/room` endpoint (requires auth)
- **Headers**: `Authorization: <token>`
- **Request**: `{ name: string }` (3-20 characters)
- **Response**: `{ roomId: number }`
- **Flow**:
  1. User enters room name
  2. Sends authenticated request to create room
  3. Receives roomId
  4. Navigates to `/canvas/:roomId`

#### **Join Room** (`/rooms` page)
- **GET** `/room/:slug` endpoint
- **Request**: Room slug in URL
- **Response**: `{ room: { id, slug, adminId, createdAt } }`
- **Flow**:
  1. User enters room name/slug
  2. Fetches room details
  3. Navigates to `/canvas/:roomId` if found

#### **Quick Start**
- Generates random room name (`room-<timestamp>`)
- Auto-creates room and joins

---

### 3. Canvas & Real-time Drawing

#### **Load Existing Shapes**
- **GET** `/chats/:roomId` endpoint
- **Response**: `{ messages: Array<{ message, userId, roomId }> }`
- **Implemented in**: `src/lib/draw/http.ts` → `getExistingShapes()`
- **Flow**:
  1. Canvas page loads
  2. Fetches all messages (shape data) for room
  3. Parses JSON shapes from messages
  4. Renders shapes on canvas

#### **WebSocket Real-time Sync**
- **Endpoint**: `ws://localhost:8080`
- **Connection**: Established in `RoomCanvas.tsx`
- **Events Sent**:
  - `join_room` - Join a canvas room
  - `chat` - Send new shape data
  - `delete` - Delete a shape
- **Events Received**:
  - `chat` - New shape from another user
  - `delete` - Shape deleted by another user

---

## 🗂️ API Utility Structure

### `/src/lib/api.ts`
Centralized API management with:

#### **Auth API**
```typescript
authAPI.signup(username, password, name)
authAPI.signin(username, password)
```

#### **Room API**
```typescript
roomAPI.create(name)
roomAPI.getBySlug(slug)
roomAPI.getChats(roomId)
```

#### **Helper Functions**
```typescript
isAuthenticated() // Check if user is logged in
getToken() // Get stored JWT
setToken(token) // Store JWT
removeToken() // Clear JWT
```

#### **Axios Interceptor**
Automatically adds `Authorization` header to authenticated requests

---

## 📍 Page-by-Page Integration

### **Landing Page** (`/`)
- Checks authentication status
- Shows "Go to My Rooms" if logged in
- Shows "Start Drawing" + "Sign In" if not

### **Sign Up** (`/signup`)
- ✅ Creates user account
- ✅ Auto-signs in after signup
- ✅ Redirects to `/rooms`

### **Sign In** (`/signin`)
- ✅ Authenticates user
- ✅ Stores JWT token
- ✅ Redirects to `/rooms`

### **Rooms Page** (`/rooms`)
- ✅ Protected route (requires auth)
- ✅ Create new room
- ✅ Join existing room
- ✅ Quick start feature
- ✅ Logout functionality

### **Canvas Page** (`/canvas/:roomId`)
- ✅ Loads existing shapes from backend
- ✅ Real-time WebSocket sync
- ✅ Drawing tools: Circle, Rectangle, Pencil, Eraser, Text
- ✅ Shapes saved to database
- ✅ Multi-user collaboration

### **Navbar Component**
- ✅ Dynamic auth state
- ✅ Shows "My Rooms" + "Logout" when logged in
- ✅ Shows "Sign In" + "Get Started" when logged out

---

## 🔑 Backend API Endpoints Summary

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/signup` | ❌ | Create user account |
| POST | `/signin` | ❌ | Authenticate user |
| POST | `/room` | ✅ | Create new room |
| GET | `/room/:slug` | ❌ | Get room by name |
| GET | `/chats/:roomId` | ❌ | Get messages/shapes |
| WS | `ws://localhost:8080` | ⚠️ Token in query | Real-time sync |

---

## 🎨 Drawing Flow

1. **User signs up/in** → Gets JWT token
2. **Creates/joins room** → Gets roomId
3. **Canvas loads** → Fetches existing shapes via GET `/chats/:roomId`
4. **WebSocket connects** → Sends `join_room` event
5. **User draws** → Shape sent via WebSocket `chat` event
6. **Other users** → Receive shape via WebSocket
7. **All shapes** → Saved to database by backend

---

## 🔒 Authentication Flow

```
User → SignUp/SignIn → Backend validates → Returns JWT
   ↓
JWT stored in localStorage
   ↓
Axios interceptor adds token to all API requests
   ↓
Protected routes check isAuthenticated()
   ↓
Backend validates token for protected endpoints
```

---

## 🌐 WebSocket Integration

**Connection**: `RoomCanvas.tsx`
```typescript
const ws = new WebSocket(`${WS_URL}?token=${jwt_token}`);
```

**Join Room**:
```typescript
ws.send(JSON.stringify({
  type: "join_room",
  roomId: roomId
}));
```

**Send Shape**:
```typescript
ws.send(JSON.stringify({
  type: "chat",
  message: JSON.stringify({ shape }),
  roomId: roomId
}));
```

**Delete Shape**:
```typescript
ws.send(JSON.stringify({
  type: "delete",
  message: JSON.stringify({ index }),
  roomId: roomId
}));
```

---

## 📦 Data Models

### User
```typescript
{
  id: string (UUID)
  email: string
  password: string (hashed)
  name: string
}
```

### Room
```typescript
{
  id: number
  slug: string (unique, 3-20 chars)
  adminId: string (FK to User)
  createdAt: Date
}
```

### Chat (Shape Data)
```typescript
{
  id: number
  roomId: number (FK to Room)
  userId: string (FK to User)
  message: string (JSON shape data)
}
```

### Shape Types
```typescript
type Shape = 
  | { type: "rect", x, y, width, height }
  | { type: "circle", centerX, centerY, radius }
  | { type: "pencil", points: [{x, y}] }
  | { type: "text", x, y, content, fontSize }
```

---

## 🚀 Getting Started

### Start Backend Services
```bash
# From project root
pnpm dev  # Starts HTTP (3001) and WebSocket (8080) backends
```

### Start Frontend
```bash
# From collabcanvas-landing
cd collabcanvas-landing
pnpm install
pnpm dev  # Starts at http://localhost:5173
```

### User Journey
1. Visit `http://localhost:5173`
2. Click "Start Drawing" → Sign up
3. Redirected to `/rooms`
4. Create a new room or join existing
5. Start drawing with real-time collaboration!

---

## ✨ Features Summary

✅ **Full authentication** (signup/signin/logout)  
✅ **JWT token management**  
✅ **Protected routes**  
✅ **Room creation & joining**  
✅ **Real-time WebSocket sync**  
✅ **Persistent shape storage**  
✅ **5 drawing tools**  
✅ **Multi-user collaboration**  
✅ **Modern responsive UI**  

All backend functionalities are now fully integrated with the frontend! 🎉
