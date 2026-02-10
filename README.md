# CollabCanvas 🎨

A real-time collaborative canvas application that enables multiple users to draw together in shared rooms. Built with a modern monorepo architecture using Turborepo, featuring Next.js, WebSockets, and PostgreSQL.

## 🌟 Features

- **User Authentication**: Secure signup and signin with JWT tokens
- **Room Management**: Create and join collaborative drawing rooms
- **Real-time Collaboration**: Draw with others simultaneously using WebSocket connections
- **Persistent Storage**: All drawings and chat messages are saved to PostgreSQL
- **Modern Stack**: Built with Next.js 16, React 19, and TypeScript
- **Monorepo Architecture**: Organized codebase with shared packages and independent services

## 🏗️ Architecture

### Apps

- **`collabcanvas-frontend`**: Next.js application with React for the user interface
- **`http-backend`**: Express.js REST API for authentication and room management
- **`ws-backend`**: WebSocket server for real-time drawing synchronization

### Shared Packages

- **`@repo/db`**: Prisma client and database schema
- **`@repo/common`**: Shared TypeScript types and Zod validation schemas
- **`@repo/backend-common`**: Shared backend configuration (JWT secrets, etc.)
- **`@repo/ui`**: Reusable React UI components
- **`@repo/eslint-config`**: Shared ESLint configurations
- **`@repo/typescript-config`**: Shared TypeScript configurations

## 🛠️ Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS 4**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **TypeScript**: Type-safe JavaScript

### Backend
- **Express.js**: HTTP server framework
- **WebSocket (ws)**: Real-time bidirectional communication
- **JWT**: JSON Web Tokens for authentication
- **CORS**: Cross-origin resource sharing support

### Database
- **PostgreSQL**: Relational database
- **Prisma ORM**: Type-safe database client
- **Prisma Adapter**: PostgreSQL connection adapter

### Development Tools
- **Turborepo**: High-performance build system for monorepos
- **pnpm**: Fast, disk space efficient package manager
- **TypeScript**: Static type checking across the entire codebase
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting

## 📋 Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- PostgreSQL database

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Omjaiswal241/CollabCanvas.git
cd CollabCanvas
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/collabcanvas?schema=public"
JWT_SECRET="your-secret-key-here"
```

### 4. Set up the database

```bash
cd packages/db
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

### 5. Start the development servers

In the root directory, run:

```bash
pnpm dev
```

This will start:
- Frontend at `http://localhost:3000`
- HTTP Backend at `http://localhost:3001`
- WebSocket Backend at `ws://localhost:8080`

## 📁 Project Structure

```
CollabCanvas/
├── apps/
│   ├── collabcanvas-frontend/    # Next.js frontend application
│   │   ├── app/                   # Next.js App Router pages
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── signin/           # Sign in page
│   │   │   ├── signup/           # Sign up page
│   │   │   ├── canvas/[roomId]/  # Collaborative canvas room
│   │   │   └── draw/             # Canvas drawing logic
│   │   ├── components/           # React components
│   │   └── config.ts             # Backend URLs configuration
│   ├── http-backend/             # Express.js REST API
│   │   └── src/
│   │       ├── index.ts          # API routes (auth, rooms, chats)
│   │       └── middleware.ts     # JWT authentication middleware
│   └── ws-backend/               # WebSocket server
│       └── src/
│           └── index.ts          # Real-time drawing sync
├── packages/
│   ├── db/                       # Prisma database package
│   │   ├── prisma/
│   │   │   └── schema.prisma    # Database schema
│   │   └── src/index.ts         # Prisma client configuration
│   ├── common/                   # Shared types and schemas
│   │   └── src/index.ts         # Zod validation schemas
│   ├── backend-common/           # Backend configuration
│   │   └── src/index.ts         # JWT secret and config
│   ├── ui/                       # Shared UI components
│   ├── eslint-config/            # ESLint configurations
│   └── typescript-config/        # TypeScript configurations
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🗄️ Database Schema

### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String
- `name`: String
- `photo`: String (Optional)

### Room
- `id`: Integer (Primary Key)
- `slug`: String (Unique)
- `createdAt`: DateTime
- `adminId`: String (Foreign Key to User)

### Chat
- `id`: Integer (Primary Key)
- `roomId`: Integer (Foreign Key to Room)
- `message`: String (Contains drawing shape data)
- `userId`: String (Foreign Key to User)

## 🔌 API Endpoints

### HTTP Backend (Port 3001)

- `POST /signup`: Create a new user account
- `POST /signin`: Authenticate and receive JWT token
- `POST /room`: Create a new drawing room (requires authentication)
- `GET /chats/:roomId`: Get chat/drawing history for a room
- `GET /room/:slug`: Get room details by slug

### WebSocket Backend (Port 8080)

Connect with JWT token as query parameter:
```javascript
ws://localhost:8080?token=YOUR_JWT_TOKEN
```

**Message Types:**
- `join_room`: Join a collaborative room
- `leave_room`: Leave a room
- `chat`: Send drawing data (shapes, coordinates)

## 🎨 How It Works

1. **Authentication**: Users sign up/sign in via the HTTP backend, receiving a JWT token
2. **Room Creation**: Authenticated users can create rooms with unique slugs
3. **WebSocket Connection**: Users connect to the WebSocket server with their JWT token
4. **Room Joining**: Users join specific rooms to collaborate
5. **Drawing Sync**: Canvas drawing events are broadcast to all users in the same room
6. **Persistence**: All drawing data is stored as chat messages in PostgreSQL
7. **History Loading**: When joining a room, existing shapes are loaded from the database

## 🧪 Available Scripts

### Root Level

- `pnpm dev`: Start all development servers
- `pnpm build`: Build all applications
- `pnpm lint`: Lint all packages
- `pnpm format`: Format code with Prettier

### Package Specific

- `pnpm --filter collabcanvas-frontend dev`: Run only frontend
- `pnpm --filter http-backend dev`: Run only HTTP backend
- `pnpm --filter ws-backend dev`: Run only WebSocket backend

## 🔧 Configuration

### Frontend Configuration

Edit [`apps/collabcanvas-frontend/config.ts`](apps/collabcanvas-frontend/config.ts):

```typescript
export const HTTP_BACKEND = "http://localhost:3001";
export const WS_URL = "ws://localhost:8080";
```

### Backend Configuration

Environment variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

ISC

## 👨‍💻 Author

**Omjaiswal241**

- GitHub: [@Omjaiswal241](https://github.com/Omjaiswal241)
- Repository: [CollabCanvas](https://github.com/Omjaiswal241/CollabCanvas)

## 🙏 Acknowledgments

- Built with [Turborepo](https://turbo.build/repo)
- Uses [Next.js](https://nextjs.org/) App Router
- Database management with [Prisma](https://www.prisma.io/)
- Real-time communication with [ws](https://github.com/websockets/ws)

---

Made with ❤️ by Om Jaiswal
