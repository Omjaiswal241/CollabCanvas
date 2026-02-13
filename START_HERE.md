# Quick Start Guide

## ✅ Backend is Already Running!

Your HTTP backend is currently running on `http://localhost:3001`

## 🚀 Quick Start - Two Options:

### Option 1: Automatic Setup (Recommended)
```powershell
.\setup-and-start.ps1
```
This script will:
- Check your configuration
- Setup the database
- Build the backend
- Start the server

### Option 2: Manual Start

**Terminal 1 - HTTP Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - WebSocket Backend:**
```powershell
.\start-ws-backend.ps1
```

**Terminal 3 - Frontend:**
```powershell
.\start-frontend.ps1
```

## 🌐 Access the App

Once all servers are running:
- Frontend: http://localhost:5173
- HTTP Backend API: http://localhost:3001
- WebSocket Backend: ws://localhost:8080

## 📝 Common Commands

### Test Backend Health
```powershell
node scripts/check-backend.js
```

### Test All Backend Features
```powershell
node scripts/test-all-backend.js
```

### Test Complete User Journey
```powershell
node scripts/test-user-journey.js
```

## 🔧 Troubleshooting

### Backend won't start?
1. Check your `.env` file has correct `DATABASE_URL`
2. Run database migrations:
   ```powershell
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   ```

### Frontend won't start?
1. Install dependencies:
   ```powershell
   cd apps/collabcanvas-landing
   npm install
   ```

### Database connection errors?
- Verify your `DATABASE_URL` in `.env` is correct
- Make sure your PostgreSQL database is running
- Check network connectivity if using remote database

## 📚 What's Working

✅ User signup and signin
✅ JWT authentication
✅ User dashboard
✅ Room creation and management
✅ User profile
✅ All backend APIs

## 🎯 Next Steps

After starting the app:
1. Sign up at http://localhost:5173/signup
2. Sign in with your credentials
3. You'll see your dashboard
4. Create rooms and start collaborating!

---

**Note:** Backend is already running! Just start the frontend with `.\start-frontend.ps1`
