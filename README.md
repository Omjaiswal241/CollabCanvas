# CollabCanvas 🎨

[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![Express](https://img.shields.io/badge/Express-5-black?style=flat&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-yellow?style=flat&logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A **real-time collaborative whiteboard** enabling multiple users to draw together, chat, and collaborate seamlessly. Built with modern web technologies for instant synchronization across all connected users.

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Automated Setup (Windows)](#-easiest-way---automated-setup-windows)
  - [Manual Setup](#-manual-setup)
  - [Running the Application](#-running-the-application)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [🔌 API Reference](#-api-reference)
- [🗄️ Database Schema](#️-database-schema)
- [🎯 Usage Flow](#-usage-flow)
- [🔧 Configuration](#-configuration)
- [🎨 Drawing Tools Guide](#-drawing-tools-guide)
- [🏗️ How It Works](#️-how-it-works)
- [🚧 Known Limitations](#-known-limitations)
- [🔮 Planned Features](#-planned-features)
- [🔧 Troubleshooting](#-troubleshooting)
- [📚 Documentation](#-documentation)
- [💬 Getting Help](#-getting-help)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👨‍💻 Author](#-author)

---

## ✨ Features

### 🎨 Drawing Tools
- **7 Tools**: Circle, Rectangle, Line, Triangle, Pencil, Eraser, Text
- **Real-time Collaboration**: See drawings from other users instantly (1.5s polling)
- **Persistent Canvas**: All shapes auto-saved to PostgreSQL with database IDs
- **Smart Eraser**: Click shapes to delete them (syncs across all users)
- **Canvas Reset**: Clear all shapes (admin only)

### 💬 Chat System
- **Real-time Chat**: Message other users in the same room
- **Message Persistence**: Chat history stored in database
- **User Identification**: Your messages (right) vs others (left)
- **Clear Chat**: Room admins can clear all messages

### 🔐 Authentication & Rooms
- **JWT Authentication**: Secure signup/signin with bcrypt password hashing
- **Room Management**: Create and join collaborative rooms
- **Share Codes**: Easy room sharing with unique slugs
- **User Profiles**: Name, email, and avatar support

### 🎯 Smart Features
- **Canvas Persistence**: Shapes survive page refreshes
- **Erase Tracking**: Deleted shapes stay deleted
- **Clear Canvas**: Room admins can reset the entire canvas
- **Modern UI**: Shadcn/ui components with beautiful design

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite 5, TypeScript, Tailwind CSS, Shadcn/ui |
| **Backend** | Express.js 5, WebSocket (ws), JWT, bcrypt |
| **Database** | PostgreSQL, Prisma ORM |
| **Architecture** | Turborepo monorepo, pnpm workspaces |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 9.0.0 (or npm)
- **PostgreSQL** ≥ 14

### 🎯 Easiest Way - Automated Setup (Windows)

```powershell
# 1. Clone the repository
git clone https://github.com/Omjaiswal241/CollabCanvas.git
cd CollabCanvas

# 2. Install dependencies
pnpm install

# 3. Copy environment file and configure it
copy .env.example .env
# Edit .env and add your DATABASE_URL and JWT_SECRET

# 4. Run automated setup (builds both backends & sets up database)
.\setup-and-start.ps1
```

The setup script will:
- ✅ Check your configuration
- ✅ Run database migrations
- ✅ Build HTTP backend
- ✅ Build WebSocket backend
- ✅ Prompt to start the application

### 🔧 Manual Setup

```bash
# 1. Clone repository
git clone https://github.com/Omjaiswal241/CollabCanvas.git
cd CollabCanvas

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL="postgresql://user:password@localhost:5432/collabcanvas"
# JWT_SECRET="your-secure-random-secret-key"

# 4. Initialize database
cd packages/db
pnpm exec prisma migrate dev
pnpm exec prisma generate
cd ../..

# 5. Build backends
cd apps/http-backend && npm run build && cd ../..
cd apps/ws-backend && npm run build && cd ../..
```

### 🚀 Running the Application

**Option 1: Using PowerShell Scripts (Windows - Recommended)**

```powershell
# Terminal 1 - HTTP Backend (Port 3001)
.\start-backend.ps1

# Terminal 2 - WebSocket Backend (Port 8080)
.\start-ws-backend.ps1

# Terminal 3 - Frontend (Port 5173)
.\start-frontend.ps1
```

**Option 2: Manual Commands**

```bash
# Terminal 1 - HTTP Backend
cd apps/http-backend
npm run dev

# Terminal 2 - WebSocket Backend
cd apps/ws-backend
npm run dev

# Terminal 3 - Frontend
cd apps/collabcanvas-landing
npm run dev
```

**🌐 Access the Application:**
- **Frontend**: http://localhost:5173
- **HTTP API**: http://localhost:3001
- **WebSocket**: ws://localhost:8080

---

## 🧪 Testing

```bash
# Test backend health
node scripts/check-backend.js

# Test all backend features
node scripts/test-all-backend.js

# Test user journey (signup → signin → create room → chat)
node scripts/test-user-journey.js

# Individual tests
node scripts/test/test-auth-api.js      # Authentication
node scripts/test/test-chat.js          # Chat functionality
node scripts/test/test-canvas-data.js   # Canvas operations
node scripts/test/test-connection.js    # WebSocket connection
```

Visit `http://localhost:5173` and start collaborating! 🎉

---

## 📁 Project Structure

```
CollabCanvas/
├── 🎨 apps/collabcanvas-landing/     # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── room/                # Room-specific components
│   │   │   │   ├── Canvas.tsx       # Canvas wrapper component
│   │   │   │   ├── ChatPanel.tsx    # Real-time chat interface
│   │   │   │   ├── DrawingToolbar.tsx # Drawing tools UI
│   │   │   │   ├── RoomHeader.tsx   # Room navigation header
│   │   │   │   └── index.ts         # Barrel exports
│   │   │   └── ui/                  # Shadcn/ui primitives
│   │   ├── pages/                   # Route pages
│   │   │   ├── Index.tsx            # Landing page
│   │   │   ├── SignIn.tsx           # Authentication
│   │   │   ├── SignUp.tsx           # User registration
│   │   │   ├── Dashboard.tsx        # User dashboard
│   │   │   ├── Rooms.tsx            # Room management
│   │   │   └── Room.tsx             # Main room orchestrator
│   │   ├── services/                # API service layer
│   │   │   ├── roomService.ts       # Room API calls
│   │   │   ├── chatService.ts       # Chat API calls
│   │   │   ├── canvasService.ts     # Canvas CRUD operations
│   │   │   └── index.ts             # Barrel exports
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useCanvasData.ts     # Canvas state & data fetching
│   │   │   ├── useCanvasDrawing.ts  # Drawing interactions
│   │   │   ├── useCanvasResize.ts   # Canvas resizing logic
│   │   │   ├── useChat.ts           # Chat functionality
│   │   │   └── index.ts             # Barrel exports
│   │   ├── types/                   # TypeScript definitions
│   │   │   ├── room.ts              # Room, Shape, Message types
│   │   │   └── index.ts             # Barrel exports
│   │   ├── utils/                   # Utility functions
│   │   │   └── canvasUtils.ts       # Canvas drawing & collision
│   │   └── lib/
│   │       ├── api.ts               # HTTP client & endpoints
│   │       ├── config.ts            # Backend URLs
│   │       └── utils.ts             # General utilities
│   ├── public/
│   │   └── robots.txt
│   ├── index.html                   # HTML entry point
│   ├── vite.config.ts               # Vite configuration
│   └── package.json
│
├── 📦 apps/
│   ├── http-backend/                # REST API Server (Port 3001)
│   │   ├── src/
│   │   │   ├── index.ts             # Express server & routes
│   │   │   └── middleware.ts        # JWT authentication
│   │   ├── dist/                    # Compiled JavaScript
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ws-backend/                  # WebSocket Server (Port 8080)
│   │   ├── src/
│   │   │   └── index.ts             # WebSocket server & handlers
│   │   ├── dist/                    # Compiled JavaScript
│   │   ├── tsconfig.json
│   │   └── package.json
│
├── 🔧 packages/                     # Shared Workspace Packages
│   ├── db/                          # Database Layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   └── migrations/          # Migration history
│   │   ├── src/
│   │   │   └── index.ts             # Prisma client export
│   │   ├── prisma.config.ts
│   │   └── package.json
│   │
│   ├── common/                      # Shared Types & Schemas
│   │   ├── src/
│   │   │   └── index.ts             # Zod schemas, TypeScript types
│   │   └── package.json
│   │
│   ├── backend-common/              # Backend Configuration
│   │   ├── src/
│   │   │   └── config.ts            # JWT_SECRET, env config
│   │   └── package.json
│   │
│   ├── ui/                          # Shared React Components
│   │   ├── src/
│   │   │   └── components/          # Reusable UI components
│   │   └── package.json
│   │
│   ├── eslint-config/               # ESLint Configurations
│   │   ├── base.js                  # Base config
│   │   ├── next.js                  # Next.js config
│   │   ├── react-internal.js        # React config
│   │   └── package.json
│   │
│   └── typescript-config/           # TypeScript Configurations
│       ├── base.json                # Base tsconfig
│       ├── nextjs.json              # Next.js tsconfig
│       ├── react-library.json       # React library tsconfig
│       └── package.json
│
├── � scripts/                      # Development & Testing Scripts
│   ├── test/                        # Test Scripts
│   │   ├── test-auth-api.js         # Authentication API tests
│   │   ├── test-canvas-data.js      # Canvas data tests
│   │   ├── test-chat-endpoint.js    # Chat endpoint tests
│   │   ├── test-chat.js             # Chat functionality tests
│   │   ├── test-connection.js       # Connection tests
│   │   ├── test-db.js               # Database tests
│   │   ├── test-drawing-flow.js     # Drawing flow tests
│   │   ├── test-existing-users.js   # User tests
│   │   ├── test-pg-direct.js        # PostgreSQL direct tests
│   │   ├── test-signin-now.js       # Signin tests
│   │   └── test-signin.js           # Signin tests
│   │
│   └── setup/                       # Setup Scripts
│       ├── add-canvas-table.js      # Create canvas table
│       ├── check-db-status.js       # Check database status
│       ├── setup-database.js        # Initialize database
│       └── setup-database-retry.js  # Database setup with retry
│
├── 📄 Configuration Files
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Root package.json
│   ├── pnpm-workspace.yaml          # pnpm workspace config
│   ├── turbo.json                   # Turborepo build pipeline
│   └── tsconfig.json                # Root TypeScript config
│
├── 🚀 PowerShell Scripts (Windows)
│   ├── setup-and-start.ps1          # Automated setup & build
│   ├── start-backend.ps1            # Start HTTP backend
│   ├── start-ws-backend.ps1         # Start WebSocket backend
│   └── start-frontend.ps1           # Start frontend dev server
│
└── 📚 docs/                         # Documentation
    ├── BACKEND_INTEGRATION.md       # API integration guide
    ├── CONTRIBUTING.md              # Contribution guidelines
    ├── MIGRATION.md                 # Database migrations
    ├── SETUP_GUIDE.md               # Detailed setup guide
    └── TESTING_GUIDE.md             # Testing instructions
```

### Package Dependencies Flow

```
collabcanvas-landing
  ├─→ @repo/common (types, schemas)
  └─→ @repo/ui (components)

http-backend
  ├─→ @repo/db (Prisma client)
  ├─→ @repo/common (validation)
  └─→ @repo/backend-common (JWT config)

ws-backend
  ├─→ @repo/db (Prisma client)
  ├─→ @repo/common (types)
  └─→ @repo/backend-common (JWT config)
```

### Key Files to Know

| File | Purpose | Important For |
|------|---------|---------------|
| **Frontend Architecture** |
| `collabcanvas-landing/src/pages/Room.tsx` | Main room orchestrator (140 lines) | Room coordination |
| `collabcanvas-landing/src/hooks/useCanvasDrawing.ts` | Drawing interactions & mouse events | Drawing features |
| `collabcanvas-landing/src/hooks/useCanvasData.ts` | Canvas state & real-time sync | Data persistence |  
| `collabcanvas-landing/src/hooks/useChat.ts` | Chat functionality & polling | Chat system |
| `collabcanvas-landing/src/utils/canvasUtils.ts` | Shape rendering & collision detection | Canvas logic |
| `collabcanvas-landing/src/services/canvasService.ts` | Canvas API calls | Backend integration |
| `collabcanvas-landing/src/components/room/*` | Reusable room components | UI components |
| `collabcanvas-landing/src/types/room.ts` | TypeScript interfaces | Type safety |
| **Backend** |
| `apps/http-backend/src/index.ts` | REST API endpoints | Backend API |
| `apps/ws-backend/src/index.ts` | WebSocket server | Real-time sync |
| **Database** |
| `packages/db/prisma/schema.prisma` | Database schema | Database structure |
| `packages/common/src/index.ts` | Shared types & Zod schemas | Type validation |
| **Configuration** |
| `collabcanvas-landing/src/lib/config.ts` | Backend URL configuration | Environment setup |

---

## 🔌 API Reference

### HTTP Endpoints (Port 3001)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/signup` | Create user account | ⛔ No |
| `POST` | `/signin` | Authenticate & get JWT | ⛔ No |
| `POST` | `/room` | Create new room | ✅ Yes |
| `GET` | `/room/:slug` | Get room by name | ⛔ No |
| `GET` | `/user/me` | Get user profile | ✅ Yes |
| `GET` | `/user/rooms` | List user's rooms | ✅ Yes |
| `GET` | `/chats/:roomId` | Load chat history | ⛔ No |
| `DELETE` | `/chats/:roomId` | Clear all chats | ✅ Admin |
| `POST` | `/canvas/:roomId` | Save canvas shape | ✅ Yes |
| `GET` | `/canvas/:roomId` | Load canvas data | ✅ Yes |
| `DELETE` | `/canvas/:roomId/:canvasId` | Delete specific shape | ✅ Yes |
| `DELETE` | `/canvas/:roomId` | Clear entire canvas | ✅ Admin |

### WebSocket (Port 8080)
**Connect**: `ws://localhost:8080?token=YOUR_JWT_TOKEN`

**Message Types**:
- `join_room` - Join a collaborative room
- `leave_room` - Leave current room
- `draw` - Broadcast new shape
- `erase` - Remove shape by index
- `clear` - Clear entire canvas
- `chat` - Send/receive chat messages

---

## 🗄️ Database Schema

```prisma
User {
  id        String   (UUID, PK)
  email     String   (Unique)
  password  String
  name      String
  photo     String?
}

Room {
  id        Int      (PK)
  slug      String   (Unique)
  adminId   String   (FK → User)
  createdAt DateTime
}

Chat {
  id        Int      (PK)
  roomId    Int      (FK → Room)
  message   String
  userId    String   (FK → User)
  createdAt DateTime
}

CanvasData {
  id        Int      (PK)
  roomId    Int      (FK → Room)
  userId    String   (FK → User)
  type      String   (draw | erase | clear)
  data      String   (JSON)
  createdAt DateTime
}
```

---

## 🎯 Usage Flow

1. **Sign Up** → Create account at `/signup`
2. **Sign In** → Authenticate at `/signin`
3. **Rooms** → Create or join rooms at `/rooms`
4. **Canvas** → Draw, chat, collaborate at `/canvas/:roomId`
5. **Share** → Copy room code to invite others

---

## 🔧 Configuration

### Environment Variables (`.env`)

Create a `.env` file in the project root with the following variables:

```env
# PostgreSQL Database Connection
# Format: postgresql://username:password@host:port/database
DATABASE_URL="postgresql://user:password@localhost:5432/collabcanvas"

# JWT Secret for Token Authentication
# Generate a secure random string (e.g., openssl rand -base64 32)
JWT_SECRET="your-super-secure-random-secret-key-here-change-in-production"
```

**Important Notes:**
- 🔒 Never commit `.env` to version control (already in `.gitignore`)
- 🔑 Generate a strong JWT_SECRET for production
- 🗄️ Ensure PostgreSQL is running and accessible
- ✅ Use `.env.example` as a template

### Frontend Configuration

The frontend automatically uses environment variables or defaults to localhost:

**File**: [apps/collabcanvas-landing/src/lib/config.ts](apps/collabcanvas-landing/src/lib/config.ts)

```typescript
export const HTTP_BACKEND = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
```

**Optional** - Create `apps/collabcanvas-landing/.env` for custom URLs:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:8080
```

---

## 🎨 Drawing Tools Guide

| Tool | Usage | Notes |
|------|-------|-------|
| **Circle** | Click & drag | Radius from min(width, height) |
| **Rectangle** | Click & drag | Supports negative dimensions |
| **Line** | Click & drag | Straight line from start to end point |
| **Triangle** | Click & drag | Isosceles triangle |
| **Pencil** | Free-hand draw | Smooth curves, rounded caps |
| **Eraser** | Click shape | Click any shape to delete (syncs instantly) |
| **Text** | Click to place | Enter text in prompt (24px Arial italic) |

**Real-time Collaboration:**
- All shapes sync across users within 1.5 seconds
- Erasures are immediately reflected for all users
- Canvas state persists through page refreshes

---

## 🚧 Known Limitations

- Freehand pencil strokes are not persisted to database (shapes only)
- Real-time sync uses polling (1.5s interval) instead of WebSocket broadcasting
- No rate limiting on API endpoints
- Fixed white color for all shapes
- No undo/redo functionality
- Desktop-optimized (limited mobile support)
- No conflict resolution for simultaneous edits

---

## 🔮 Planned Features

- [ ] WebSocket broadcasting for instant shape updates (replace polling)
- [ ] Freehand pencil stroke persistence
- [ ] Color picker & line width control
- [ ] Undo/redo functionality
- [ ] Shape editing & moving (drag shapes)
- [ ] User presence indicators (who's online)
- [ ] Mobile touch support
- [ ] Export canvas (PNG/SVG)
- [ ] Public/private rooms
- [ ] Rate limiting & security improvements
- [ ] Cursor tracking for other users
- [ ] Shape layers & z-index control

---

## � Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Linux/Mac: sudo systemctl status postgresql

# Test database connection
node scripts/test/test-db.js

# Reset database migrations
cd packages/db
npx prisma migrate reset
npx prisma migrate dev
```

### Backend Not Starting
```bash
# Check if ports are already in use
# Windows:
netstat -ano | findstr :3001
netstat -ano | findstr :8080

# Kill process if needed
taskkill /PID <process_id> /F

# Rebuild backends
cd apps/http-backend && npm run build
cd apps/ws-backend && npm run build
```

### Frontend Connection Errors
1. Verify both backends are running
2. Check browser console for errors
3. Verify `.env` file exists in root directory
4. Check [config.ts](apps/collabcanvas-landing/src/lib/config.ts) has correct URLs

### Common Errors

| Error | Solution |
|-------|----------|
| `DATABASE_URL not found` | Copy `.env.example` to `.env` and configure |
| `Port 3001 already in use` | Kill existing process or change port |
| `Prisma Client not generated` | Run `npx prisma generate` in `packages/db` |
| `WebSocket connection failed` | Ensure WebSocket backend is running on port 8080 |
| `JWT malformed` | Check JWT_SECRET is set in `.env` |

---

## �📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Quick start guide with manual setup options
- **[BACKEND_TEST_RESULTS.md](BACKEND_TEST_RESULTS.md)** - Backend functionality test results
- **[QUICK_START.md](QUICK_START.md)** - Getting SignUp/SignIn working quickly
- **[docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)** - Complete API integration guide
- **[docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Step-by-step testing checklist
- **[docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Detailed setup instructions
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines and workflow

---

## 🏗️ How It Works

### Architecture Overview

```
┌─────────────────┐
│   Frontend      │ ← User Browser (React + Vite)
│  (Port 5173)    │
└────────┬────────┘
         │
         ├─── HTTP ───→ ┌──────────────────┐
         │              │  HTTP Backend    │ ← REST API (Express)
         │              │  (Port 3001)     │
         │              └────────┬─────────┘
         │                       │
         └── WebSocket →  ┌──────┴──────────┐
                         │  WS Backend     │ ← Real-time (WebSocket)
                         │  (Port 8080)    │
                         └────────┬─────────┘
                                  │
                         ┌────────┴─────────┐
                         │   PostgreSQL     │ ← Database (Prisma ORM)
                         │   (Port 5432)    │
                         └──────────────────┘
```

### Data Flow

1. **Authentication Flow**
   - User signs up/in via HTTP API
   - Backend validates credentials with bcrypt
   - JWT token issued and stored in localStorage
   - Token sent with all authenticated requests

2. **Drawing Flow**
   - User draws on canvas → Captured by useCanvasDrawing hook
   - Shape data saved via canvasService → PostgreSQL
   - Real-time polling (1.5s) fetches new shapes via useCanvasData
   - Other users' shapes automatically merge into local state
   - canvasUtils renders all shapes on canvas

3. **Chat Flow**
   - Message sent via chatService → Stored in Chat table
   - Polling (2s) via useChat hook fetches new messages
   - Chat history loaded on room join from database

### Modular Architecture Benefits

The codebase follows a clean, layered architecture:

```
Pages (Orchestration)
   ↓
Hooks (Business Logic)
   ↓
Services (API Calls)
   ↓
Utils (Pure Functions)
```

**Benefits:**
- ✅ **Separation of Concerns**: UI, logic, and data are decoupled
- ✅ **Reusability**: Hooks and services can be used in other components
- ✅ **Testability**: Each layer can be tested independently
- ✅ **Maintainability**: Easy to locate and fix bugs
- ✅ **Scalability**: Simple to add new features without breaking existing code
- ✅ **Type Safety**: Centralized TypeScript interfaces ensure consistency

---

## 💬 Getting Help

If you encounter issues or have questions:

1. **Check Documentation**: Start with [START_HERE.md](START_HERE.md) and [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
2. **Common Issues**: Review the [🔧 Troubleshooting](#-troubleshooting) section above
3. **Test Scripts**: Run `node scripts/check-backend.js` to verify backend status
4. **GitHub Issues**: [Report bugs or request features](https://github.com/Omjaiswal241/CollabCanvas/issues)
5. **GitHub Discussions**: Ask questions in the community

**Useful Commands for Debugging:**
```bash
# Check backend health
node scripts/check-backend.js

# Test complete user journey
node scripts/test-user-journey.js

# View database status
cd packages/db && npx prisma studio

# Check Prisma migration status
cd packages/db && npx prisma migrate status
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for detailed information on:

- Setting up the development environment
- Code style guidelines
- Commit message conventions
- Pull request process
- Testing requirements

**Quick Start for Contributors:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

For detailed guidelines, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

## 📝 License

ISC License - see [LICENSE](LICENSE) for details

---

## 👨‍💻 Author

**Om Jaiswal**  
GitHub: [@Omjaiswal241](https://github.com/Omjaiswal241)  
Repository: [CollabCanvas](https://github.com/Omjaiswal241/CollabCanvas)

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

[Report Bug](https://github.com/Omjaiswal241/CollabCanvas/issues) · [Request Feature](https://github.com/Omjaiswal241/CollabCanvas/issues) · [Documentation](https://github.com/Omjaiswal241/CollabCanvas/wiki)

Made with ❤️ by [Om Jaiswal](https://github.com/Omjaiswal241)

</div>
