# CollabCanvas 🎨

[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

A **real-time collaborative whiteboard** enabling multiple users to draw together, chat, and collaborate seamlessly. Built with modern web technologies for instant synchronization across all connected users.

---

## ✨ Features

### 🎨 Drawing Tools
- **5 Tools**: Circle, Rectangle, Pencil, Eraser, Text
- **Real-time Sync**: Instant collaboration across all users
- **Persistent Canvas**: All drawings auto-saved to PostgreSQL
- **Hover Highlighting**: Visual feedback when erasing shapes

### 💬 Chat System
- **Real-time Chat**: Message other users in the same room
- **Message Persistence**: Chat history stored in database
- **User Identification**: Your messages (right) vs others (left)
- **Clear Chat**: Room admins can clear all messages

### 🔐 Authentication & Rooms
- **JWT Authentication**: Secure signup/signin
- **Room Management**: Create and join collaborative rooms
- **Share Codes**: Easy room sharing with unique slugs
- **User Profiles**: Name, email, and avatar support

### 🎯 Smart Features
- **Canvas Persistence**: Shapes survive page refreshes
- **Erase Tracking**: Deleted shapes stay deleted
- **Clear Canvas**: Room admins can reset the entire canvas
- **Modern UI**: Shadcn/ui components with dark mode support

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite 5, TypeScript, Tailwind CSS, Shadcn/ui |
| **Backend** | Express.js, WebSocket (ws), JWT |
| **Database** | PostgreSQL, Prisma ORM |
| **Architecture** | Turborepo monorepo, pnpm workspaces |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- pnpm ≥ 9.0.0
- PostgreSQL ≥ 14

### Installation

```bash
# Clone repository
git clone https://github.com/Omjaiswal241/CollabCanvas.git
cd CollabCanvas

# Install dependencies
pnpm install

# Setup environment
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/collabcanvas"' > .env
echo 'JWT_SECRET="your-secret-key-change-in-production"' >> .env

# Initialize database
cd packages/db
pnpm exec prisma migrate dev
pnpm exec prisma generate
cd ../..

# Start backend services
pnpm dev

# Start frontend (in new terminal)
cd collabcanvas-landing
pnpm dev
```

Visit `http://localhost:5173` and start collaborating! 🎉

---

## 📁 Project Structure

```
CollabCanvas/
├── 🎨 collabcanvas-landing/          # PRIMARY Frontend Application
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── Canvas.tsx           # Main canvas container
│   │   │   ├── ChatPanel.tsx        # Real-time chat interface
│   │   │   ├── IconButton.tsx       # Toolbar buttons
│   │   │   ├── RoomCanvas.tsx       # Room-specific canvas
│   │   │   └── ui/                  # Shadcn/ui primitives
│   │   ├── pages/                   # Route pages
│   │   │   ├── Index.tsx            # Landing page
│   │   │   ├── SignIn.tsx           # Authentication
│   │   │   ├── SignUp.tsx           # User registration
│   │   │   ├── Rooms.tsx            # Room management
│   │   │   └── Canvas.tsx           # Drawing canvas
│   │   ├── lib/
│   │   │   ├── draw/
│   │   │   │   ├── Game.ts          # Canvas logic & WebSocket
│   │   │   │   └── http.ts          # Canvas data API
│   │   │   ├── api.ts               # HTTP client & endpoints
│   │   │   ├── config.ts            # Backend URLs
│   │   │   └── utils.ts             # Utility functions
│   │   └── hooks/                   # Custom React hooks
│   ├── public/
│   │   ├── favicon.png              # Website icon
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
│   ├── ws-backend/                  # WebSocket Server (Port 8081)
│   │   ├── src/
│   │   │   └── index.ts             # WebSocket server & handlers
│   │   ├── dist/                    # Compiled JavaScript
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── collabcanvas-frontend/       # Legacy Next.js (Deprecated)
│       └── ...
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
├── 📄 Configuration Files
│   ├── .env                         # Environment variables (gitignored)
│   ├── package.json                 # Root package.json
│   ├── pnpm-workspace.yaml          # pnpm workspace config
│   ├── turbo.json                   # Turborepo build pipeline
│   └── tsconfig.json                # Root TypeScript config
│
└── 📚 Documentation
    ├── README.md                    # Main documentation (this file)
    ├── BACKEND_INTEGRATION.md       # API integration guide
    ├── TESTING_GUIDE.md             # Testing instructions
    ├── SETUP_GUIDE.md               # Detailed setup guide
    └── MIGRATION.md                 # Database migrations
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
| `collabcanvas-landing/src/lib/draw/Game.ts` | Canvas rendering & WebSocket logic | Drawing features |
| `collabcanvas-landing/src/components/ChatPanel.tsx` | Real-time chat interface | Chat functionality |
| `apps/http-backend/src/index.ts` | REST API endpoints | Backend integration |
| `apps/ws-backend/src/index.ts` | WebSocket server | Real-time sync |
| `packages/db/prisma/schema.prisma` | Database schema | Database structure |
| `packages/common/src/index.ts` | Shared types & Zod schemas | Type safety |
| `collabcanvas-landing/src/lib/api.ts` | API client & axios setup | HTTP requests |
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
| `GET` | `/canvas/:roomId` | Load canvas data | ✅ Yes |
| `DELETE` | `/canvas/:roomId` | Clear canvas | ✅ Admin |

### WebSocket (Port 8081)
**Connect**: `ws://localhost:8081?token=YOUR_JWT_TOKEN`

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

### Frontend (`collabcanvas-landing/src/lib/config.ts`)
```typescript
export const HTTP_BACKEND = "http://localhost:3001";
export const WS_URL = "ws://localhost:8081";
```

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/collabcanvas"
JWT_SECRET="change-this-in-production"
```

---

## 🎨 Drawing Tools Guide

| Tool | Usage | Notes |
|------|-------|-------|
| **Circle** | Click & drag | Radius from max(width, height) |
| **Rectangle** | Click & drag | Supports negative dimensions |
| **Pencil** | Free-hand draw | Smooth curves, rounded caps |
| **Eraser** | Click shape | Hover to highlight before delete |
| **Text** | Click to place | Enter text in prompt (24px Arial) |

---

## 🚧 Known Limitations

- ⚠️ Passwords stored in plain text (NOT production-ready)
- No rate limiting on API endpoints
- Eraser uses array index (potential race conditions)
- Fixed white color for all shapes
- No undo/redo functionality
- Desktop-optimized (limited mobile support)

---

## 🔮 Planned Features

- [ ] Password hashing (bcrypt)
- [ ] Color picker & line width control
- [ ] Undo/redo functionality
- [ ] Shape editing & moving
- [ ] User presence indicators
- [ ] Mobile touch support
- [ ] Export canvas (PNG/SVG)
- [ ] Public/private rooms

---

## 📚 Documentation

- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - Complete API integration guide
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing checklist
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

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
