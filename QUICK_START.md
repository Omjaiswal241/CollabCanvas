# 🚀 Quick Start Guide - Getting SignUp/SignIn Working

## Step 1: Database Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your PostgreSQL database URL:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/collabcanvas"
   JWT_SECRET="your_secure_random_secret_key"
   ```

3. **Run database migrations:**
   ```bash
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   ```

## Step 2: Start Backend Servers

### Terminal 1 - HTTP Backend (Port 3001):
```bash
cd apps/http-backend
npm install
npm run dev
```

### Terminal 2 - WebSocket Backend (Port 8080):
```bash
cd apps/ws-backend
npm install
npm run dev
```

## Step 3: Start Frontend

### Terminal 3 - Landing Page:
```bash
cd apps/collabcanvas-landing
npm install
npm run dev
```

The app will open at `http://localhost:5173` (or similar)

## Step 4: Test Authentication

1. **Sign Up:**
   - Go to `http://localhost:5173/signup`
   - Enter name, email, password
   - Click "Create Account"
   - You should be redirected to sign in

2. **Sign In:**
   - Enter your email and password
   - Click "Sign In"
   - You should be logged in and redirected to home

## Troubleshooting

### Backend not connecting?
- Check that backend is running on port 3001
- Check browser console for CORS errors
- Verify DATABASE_URL is correct in `.env`

### Database errors?
```bash
# Reset database if needed
cd packages/db
npx prisma migrate reset
npx prisma generate
```

### CORS issues?
The backend already has CORS enabled, but make sure it's running.

### Check backend is running:
```bash
curl http://localhost:3001/chats/1
# Should return {"messages": []}
```

## What's Working Now

✅ SignUp creates user accounts in database
✅ Passwords are hashed with bcrypt
✅ SignIn validates credentials
✅ JWT tokens are generated and stored
✅ Loading states and error messages
✅ Form validation

## Next Steps

After authentication works, you can:
- Create rooms
- Invite collaborators
- Start drawing together
- Use real-time chat
