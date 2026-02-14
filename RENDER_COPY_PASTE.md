# 🚀 Render Deployment - Copy & Paste Guide

Follow these steps exactly. Copy-paste the values below.

---

## STEP 1: Create Neon Database (3 minutes)

1. Go to https://neon.tech
2. Sign up/Login
3. Click **"Create a project"**
4. Name: `collabcanvas`
5. Region: `US East (Ohio)` (or closest to you)
6. Click **"Create project"**
7. **COPY the connection string** - you'll need it 3 times

Your connection string looks like:
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/collabcanvas?sslmode=require
```

---

## STEP 2: Generate JWT Secret (1 minute)

Run this command on your computer:
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

**Save this secret** - you'll use it 2 times (same value for both backends)

---

## STEP 3: Deploy HTTP Backend (10 minutes)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** → Select your repository
4. Fill in these values:

### Basic Info:
- **Name**: `collabcanvas-http-backend`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Node`

### Build & Start:
- **Build Command**: 
  ```
  pnpm install && pnpm --filter http-backend run build
  ```

- **Start Command**:
  ```
  cd apps/http-backend && node dist/index.js
  ```

### Instance Type:
- **Plan**: `Free`

### Advanced (Click "Advanced" button):

#### Environment Variables (Click "Add Environment Variable" for each):

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste your Neon connection string here |
| `JWT_SECRET` | Paste your generated secret here |
| `NODE_ENV` | `production` |

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **COPY YOUR SERVICE URL** (e.g., `https://collabcanvas-http-backend.onrender.com`)
8. Test it: Open `https://YOUR-URL.onrender.com/health` - should show `{"status":"ok"}`

---

## STEP 4: Deploy WebSocket Backend (10 minutes)

1. Click **"New +"** → **"Web Service"**
2. Connect your repository again
3. Fill in these values:

### Basic Info:
- **Name**: `collabcanvas-ws-backend`
- **Region**: `Oregon (US West)` (same as HTTP backend)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Node`

### Build & Start:
- **Build Command**: 
  ```
  pnpm install && pnpm --filter ws-backend run build
  ```

- **Start Command**:
  ```
  cd apps/ws-backend && node dist/index.js
  ```

### Instance Type:
- **Plan**: `Free`

### Advanced:

#### Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste your Neon connection string (SAME as HTTP backend) |
| `JWT_SECRET` | Paste your secret (SAME as HTTP backend - MUST match!) |
| `NODE_ENV` | `production` |

4. Click **"Create Web Service"**
5. Wait 5-10 minutes
6. **COPY YOUR SERVICE URL** (e.g., `https://collabcanvas-ws-backend.onrender.com`)

---

## STEP 5: Deploy Frontend (10 minutes)

1. Click **"New +"** → **"Static Site"**
2. Connect your repository
3. Fill in these values:

### Basic Info:
- **Name**: `collabcanvas-frontend`
- **Branch**: `main`
- **Root Directory**: (leave empty)

### Build Settings:
- **Build Command**: 
  ```
  pnpm install && cd apps/collabcanvas-landing && pnpm run build
  ```

- **Publish Directory**:
  ```
  apps/collabcanvas-landing/dist
  ```

### Advanced:

#### Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://collabcanvas-http-backend.onrender.com` (your HTTP backend URL) |
| `VITE_WS_URL` | `wss://collabcanvas-ws-backend.onrender.com` (your WS backend URL with wss://) |

⚠️ **IMPORTANT**: 
- Use YOUR actual backend URLs from Steps 3 & 4
- WebSocket URL uses `wss://` NOT `ws://`

4. Click **"Create Static Site"**
5. Wait 5-10 minutes
6. Your frontend will be live at `https://collabcanvas-frontend.onrender.com`

---

## STEP 6: Update CORS (2 minutes)

1. Go back to your **HTTP Backend** service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://collabcanvas-frontend.onrender.com` (your frontend URL)
5. Click **"Save Changes"** (will auto-redeploy)

---

## STEP 7: Run Database Migration (5 minutes)

### Option A: From Your Computer (Easiest)

1. Update your local `.env` file:
   ```bash
   DATABASE_URL="your-neon-connection-string-here"
   ```

2. Run:
   ```bash
   cd packages/db
   npx prisma migrate deploy
   npx prisma generate
   ```

### Option B: From Render Shell

1. Go to your HTTP Backend service
2. Click **"Shell"** tab (top right)
3. Run:
   ```bash
   cd packages/db
   npx prisma migrate deploy
   ```

---

## ✅ VERIFICATION

Test your deployed app:

1. **Frontend**: Visit `https://collabcanvas-frontend.onrender.com`
2. **Signup**: Create a new account
3. **Login**: Sign in
4. **Create Room**: Make a new room
5. **Draw**: Draw on the canvas
6. **Chat**: Send a message
7. **Real-time**: Open the same room in another tab/device - should sync!

---

## 📊 Summary

You now have:
- ✅ Free Neon PostgreSQL database (3GB)
- ✅ HTTP Backend API on Render
- ✅ WebSocket Backend on Render  
- ✅ Static Frontend on Render
- 💰 **Total Cost: $0/month** (with free tier limitations)

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after idle takes 30-60 seconds (cold start)
- Good for development/testing

### Upgrade to Production ($14/month):
- HTTP Backend: $7/month (24/7, no cold starts)
- WS Backend: $7/month (24/7)
- Neon: Free (3GB is sufficient) or $19/month for Pro

---

## 🐛 Common Issues

### "Application failed to respond"
- Wait 60 seconds (cold start on free tier)
- Check Render logs for errors

### "CORS error" 
- Make sure you added `FRONTEND_URL` to HTTP backend
- Use your actual frontend URL

### "WebSocket connection failed"
- Make sure you used `wss://` (not `ws://`) in `VITE_WS_URL`

### "Cannot connect to database"
- Verify DATABASE_URL is correct
- Check Neon dashboard - database should show "Active"

### "JWT verification failed"  
- JWT_SECRET must be IDENTICAL in both backends
- Check both backend environment variables

---

## 🎉 Done!

Your CollabCanvas app is now live! Share your frontend URL with others.

Need help? Check the detailed guide: [NEON_RENDER_DEPLOY.md](./NEON_RENDER_DEPLOY.md)
