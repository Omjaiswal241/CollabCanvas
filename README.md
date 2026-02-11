# CollabCanvas 🎨

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=flat&logo=turborepo)](https://turbo.build/)

A **real-time collaborative canvas application** that enables multiple users to draw together in shared rooms. Built with Next.js, WebSockets, PostgreSQL, and Turborepo monorepo architecture.

## ✨ Features

- 🎨 **5 Drawing Tools**: Circle, Rectangle, Pencil, Eraser, and Text
- ⚡ **Real-time Collaboration**: Instant synchronization across all users
- 🔐 **JWT Authentication**: Secure signup and signin
- 💾 **Persistent Storage**: All drawings saved to PostgreSQL
- 🏗️ **Monorepo Architecture**: Organized with Turborepo and shared packages

## 🛠️ Tech Stack

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, HTML Canvas API  
**Backend**: Express.js, WebSocket (ws), JWT, CORS  
**Database**: PostgreSQL, Prisma ORM  
**Tools**: Turborepo, pnpm, ESLint, Zod

## 🏗️ Architecture

**Apps**:
- `collabcanvas-frontend` - Next.js frontend
- `http-backend` - Express.js REST API
- `ws-backend` - WebSocket server

**Shared Packages**:
- `@repo/db` - Prisma client & schema
- `@repo/common` - Shared types & Zod schemas
- `@repo/backend-common` - Backend config (JWT, etc.)
- `@repo/ui` - React UI components
- `@repo/eslint-config` - ESLint configs
- `@repo/typescript-config` - TypeScript configs



## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- PostgreSQL >= 14
- Git

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

This will install all dependencies for all workspace packages using pnpm's efficient linking.

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/collabcanvas?schema=public"
JWT_SECRET="your-secret-key-here"
```

**Important**: Replace `user`, `password`, and database name with your PostgreSQL credentials.

### 4. Set up the database

Initialize the database and run migrations:

```bash
cd packages/db
pnpm exec prisma migrate dev
pnpm exec prisma generate
cd ../..
```

This will:
- Create the database if it doesn't exist
- Run all migrations to create tables
- Generate Prisma Client for type-safe database access

### 5. Start the development servers

From the root directory:

```bash
pnpm dev
```

This will start all services concurrently:
- 🌐 **Frontend**: `http://localhost:3000`
- 🔧 **HTTP Backend**: `http://localhost:3001`
- ⚡ **WebSocket Backend**: `ws://localhost:8080`

Then visit `http://localhost:3000`, sign up, create a room, and start drawing!
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
│   ├── collabcanvas-frontend/    # Next.js app
│   ├── http-backend/             # Express REST API
│   └── ws-backend/               # WebSocket server
├── packages/
│   ├── db/                      # Prisma schema & client
│   ├── common/                  # Shared types & Zod schemas
│   ├── backend-common/          # Backend config
│   ├── ui/                      # Shared React components
│   ├── eslint-config/           # ESLint configs
│   └── typescript-config/       # TypeScript configs
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🗄️ Database Schema

**User**: `id` (UUID), `email` (unique), `password`, `name`, `photo` (optional)  
**Room**: `id`, `slug` (unique), `createdAt`, `adminId` (FK to User)  
**Chat**: `id`, `roomId` (FK to Room), `message` (JSON shape data), `userId` (FK to User)

## 🔌 API Endpoints

### HTTP Backend (Port 3001)
- `POST /signup` - Create user account
- `POST /signin` - Authenticate & get JWT token
- `POST /room` - Create room (requires auth)
- `GET /chats/:roomId` - Get room drawing history
- `GET /room/:slug` - Get room details

### WebSocket (Port 8080)
Connect: `ws://localhost:8080?token=YOUR_JWT_TOKEN`

**Messages**:
- `join_room` - Join a room
- `leave_room` - Leave a room
- `chat` - Send/receive drawing shapes
- `delete` - Delete shapes

**Shape Types**: `rect`, `circle`, `pencil`, `text`



## 🧪 Available Scripts

### Root Level

- `pnpm dev`: Start all development servers concurrently
- `pnpm build`: Build all applications and packages
- `pnpm lint`: Lint all packages with ESLint
- `pnpm format`: Format code with Prettier

### Package Specific

- `pnpm --filter collabcanvas-frontend dev`: Run only frontend development server
- `pnpm --filter http-backend dev`: Run only HTTP backend server
- `pnpm --filter ws-backend dev`: Run only WebSocket backend server

## 🧪 Testing

### Manual Testing

Currently, the project relies on manual testing. Here's how to test key features:

#### Authentication Flow
1. Start all services with `pnpm dev`
2. Navigate to signup page
3. Create account with valid email/password
4. Verify user created in database: `pnpm exec prisma studio`
5. Sign in with credentials
6. Verify JWT token received in browser DevTools

#### Drawing Tools
1. Create/join a room
2. Test each tool (circle, rectangle, pencil, eraser, text)
3. Verify shapes render correctly
4. Check shapes persist in database (Chat table)
5. Verify canvas clears and redraws properly

#### Real-time Collaboration
1. Open room in two browser windows
2. Draw in one window
3. Verify shape appears in both windows instantly
4. Test deletion in one window
5. Verify deletion syncs to other window
6. Check WebSocket messages in Network tab

#### Database Testing
```bash
# View database in browser
cd packages/db
pnpm exec prisma studio

# Check migrations status
pnpm exec prisma migrate status

# Reset database (CAREFUL - deletes all data)
pnpm exec prisma migrate reset
```

### Future Testing Plans
- [ ] Unit tests with Jest/Vitest
- [ ] Component tests with React Testing Library
- [ ] E2E tests with Playwright
- [ ] API integration tests with Supertest
- [ ] WebSocket connection tests
- [ ] Load testing with Artillery or k6

## 🎨 Drawing Tools Guide

### Circle Tool
- Click and drag to define the circle's bounding box
- Radius calculated from the maximum of width or height
- Released circles are outlined in white

### Rectangle Tool
- Click and drag to create rectangles
- Supports negative dimensions (drag in any direction)
- Dimensions normalized during rendering

### Pencil Tool
- Free-hand drawing with smooth curves
- Captures points during mouse movement
- Line cap and join set to "round" for smooth appearance
- Minimum 2 points required to create a stroke

### Eraser Tool
- Hover over shapes to see red highlighting
- Click to delete highlighted shape
- Uses collision detection algorithms:
  - **Rectangles**: Point-in-rectangle test with normalized bounds
  - **Circles**: Distance from center compared to radius
  - **Pencil**: Point-to-line distance with 12px threshold
  - **Text**: Point-in-bounding-box test
- Deletion synchronized across all clients

### Text Tool
- Click to position text
- Prompt opens for text input
- Default font size: 24px Arial
- Baseline set to "top" for consistent positioning
- Empty or whitespace-only text rejected

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

Example `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/collabcanvas?schema=public"
JWT_SECRET="your-very-secure-secret-key-here-change-in-production"
```

## ⚡ Performance & Optimization

### Canvas Rendering
- **Efficient Redraw**: Full canvas clear and redraw on any change
- **Shape Batching**: All shapes rendered in single paint cycle
- **Line Optimization**: Rounded line caps and joins for smooth pencil strokes
- **Hover Highlighting**: Minimal redraws for eraser hover states

### Network Optimization
- **Binary Protocol**: WebSocket messages use JSON (consider MessagePack for optimization)
- **Shape History Limit**: Only last 50 shapes fetched per room (configurable)
- **Connection Reuse**: Single WebSocket connection per client
- **Delta Updates**: Only new/deleted shapes transmitted (not full state)

### Database Performance
- **Indexed Queries**: Primary keys and unique constraints for fast lookups
- **Connection Pooling**: Prisma manages PostgreSQL connections efficiently
- **Selective Fetch**: ORDER BY and TAKE for paginated shape history
- **Write Optimization**: Async database writes don't block WebSocket broadcasts

### Best Practices
- **Client-Side Prediction**: Immediate local render before server confirmation
- **Collision Detection**: Optimized algorithms for shape hit testing
- **Memory Management**: Proper cleanup on component unmount
- **Canvas Sizing**: Fixed dimensions prevent layout recalculation

## 🔍 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running on the specified port
- Verify database credentials in `DATABASE_URL`
- Check if the database exists: `psql -l`
- Run migrations: `cd packages/db && pnpm exec prisma migrate dev`

### WebSocket Connection Failed
- Verify JWT token is valid and not expired
- Check if WS backend is running on port 8080
- Ensure firewall allows WebSocket connections
- Check browser console for connection errors

### Shapes Not Syncing
- Confirm all users are in the same room
- Check WebSocket connection status
- Verify database is accepting writes
- Check server logs for broadcast errors

### Build Errors
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear Turborepo cache: `pnpm exec turbo clean`
- Regenerate Prisma client: `cd packages/db && pnpm exec prisma generate`

## ⚠️ Known Limitations

- **Drawing History**: Only last 50 shapes loaded per room (configurable in backend)
- **Concurrent Editing**: No conflict resolution for simultaneous edits
- **Shape Deletion**: Deletion by index may cause race conditions with rapid additions
- **Text Editing**: Once created, text content cannot be edited (only deleted)
- **Undo/Redo**: Not currently implemented
- **Color Selection**: All shapes drawn in white (hardcoded)
- **Line Width**: Fixed line widths for all shapes
- **Mobile Support**: Optimized for desktop, touch events not fully supported

## 🚀 Deployment Considerations

### Environment Variables
- Set strong `JWT_SECRET` in production
- Use connection pooling for `DATABASE_URL` (e.g., with Prisma Data Platform)

### Security
- Implement rate limiting on authentication endpoints
- Add password hashing (currently storing plain text - **NOT PRODUCTION READY**)
- Enable HTTPS/WSS for encrypted connections
- Implement CORS restrictions for specific domains

### Scaling
- Consider Redis for WebSocket session management
- Implement horizontal scaling with sticky sessions or shared state
- Use PostgreSQL read replicas for shape history queries
- Add CDN for frontend assets

## 🚧 Future Enhancements

### High Priority
- [ ] **Password Hashing**: Implement bcrypt/argon2 for secure password storage
- [ ] **Color Picker**: Allow users to select colors for shapes
- [ ] **Line Width Control**: Adjustable stroke width for all drawing tools
- [ ] **Undo/Redo**: Implement local and synchronized undo/redo functionality
- [ ] **Shape Editing**: Ability to move, resize, and edit existing shapes
- [ ] **User Presence**: Show active users and cursor positions in real-time

### Medium Priority
- [ ] **Mobile Support**: Touch event handlers for tablets and phones
- [ ] **Export Canvas**: Download drawings as PNG/SVG/PDF
- [ ] **Layers System**: Multiple layers for complex drawings
- [ ] **Shape Selection**: Multi-select, grouping, and bulk operations
- [ ] **Grid & Snap**: Alignment guides and snap-to-grid functionality
- [ ] **Room Permissions**: Public/private rooms, view-only access

### Low Priority
- [ ] **Chat Feature**: Text chat alongside collaborative drawing
- [ ] **Drawing Templates**: Predefined templates and backgrounds
- [ ] **Animation**: Record and playback drawing sessions
- [ ] **Shape Library**: Save and reuse custom shapes
- [ ] **Collaborative Cursors**: See other users' cursor positions
- [ ] **Version History**: Timeline of canvas changes with restore capability

### Technical Improvements
- [ ] **Optimized Rendering**: Canvas optimization for hundreds of shapes
- [ ] **Conflict Resolution**: CRDT-based approach for concurrent edits
- [ ] **Connection Recovery**: Auto-reconnect with state sync
- [ ] **Rate Limiting**: Implement rate limits on API and WebSocket
- [ ] **Testing**: Unit, integration, and E2E tests
- [ ] **Docker Support**: Containerization for easy deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/CollabCanvas.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `pnpm install`
5. Make your changes

### Code Standards
- Follow existing code style and conventions
- Write TypeScript with proper typing (avoid `any`)
- Add Zod schemas for new API endpoints
- Update Prisma schema if database changes needed
- Test your changes across all affected packages

### Commit Guidelines
- Use descriptive commit messages
- Follow conventional commits format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(canvas): add color picker tool`

### Pull Request Process
1. Update documentation for significant changes
2. Ensure the build passes: `pnpm build`
3. Run linting: `pnpm lint`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request with clear description
6. Link relevant issues if applicable

### Development Tips
- Use Turborepo for efficient builds: changes trigger only affected packages
- Prisma changes require: `cd packages/db && pnpm exec prisma generate`
- Test WebSocket changes with multiple browser windows
- Check database state with: `pnpm exec prisma studio`

## ❓ Frequently Asked Questions

### General Questions

**Q: Is this production-ready?**  
A: No, this is a demonstration/learning project. Key issues: passwords stored in plain text, no rate limiting, limited error handling, and no comprehensive security measures.

**Q: Can I use this for my project?**  
A: Yes! It's ISC licensed. However, please address security concerns (password hashing, validation, rate limiting) before production use.

**Q: How many users can collaborate simultaneously?**  
A: Theoretical limit depends on server resources. Not optimized for scale yet - recommend testing with <50 concurrent users per room.

### Technical Questions

**Q: Why are shapes stored as chat messages?**  
A: The Chat table acts as an event log. Each message contains shape data, allowing history replay and extensibility for future features like chat integration.

**Q: How does shape deletion work with indices?**  
A: Shapes are deleted by array index. This can cause race conditions if shapes are added/deleted simultaneously. Future enhancement: use unique shape IDs.

**Q: Can I add more drawing tools?**  
A: Yes! Add new tool types to the `Tool` type in [Canvas.tsx](apps/collabcanvas-frontend/components/Canvas.tsx), implement rendering in [Game.ts](apps/collabcanvas-frontend/app/draw/Game.ts), and add the tool button to the toolbar.

**Q: How do I change canvas background color?**  
A: Modify the `clearCanvas()` method in [Game.ts](apps/collabcanvas-frontend/app/draw/Game.ts) line ~205. Change `ctx.fillStyle` and `ctx.fillRect()` values.

**Q: Can I deploy this on Vercel/Netlify?**  
A: Frontend: Yes. Backends: You'll need separate hosting for Express and WebSocket servers (Railway, Render, DigitalOcean, or AWS). WebSocket requires persistent connections.

### Development Questions

**Q: How do I add a new API endpoint?**  
A: 
1. Add route in [http-backend/src/index.ts](apps/http-backend/src/index.ts)
2. Create Zod schema in [packages/common/src/index.ts](packages/common/src/index.ts)
3. Update Prisma schema if database changes needed
4. Run `pnpm exec prisma migrate dev` and `pnpm exec prisma generate`

**Q: Why is Turborepo used?**  
A: Turborepo provides intelligent caching and parallel execution for monorepo builds. Changes to shared packages automatically trigger rebuilds in dependent apps.

**Q: Package installation fails - what should I do?**  
A: Ensure you're using pnpm 9+. Try: `pnpm install --frozen-lockfile`. If issues persist, delete `node_modules` and `pnpm-lock.yaml`, then reinstall.

## 📝 License

ISC

## 👨‍💻 Author

**Omjaiswal241**

- GitHub: [@Omjaiswal241](https://github.com/Omjaiswal241)
- Repository: [CollabCanvas](https://github.com/Omjaiswal241/CollabCanvas)

## 🙏 Acknowledgments

### Technologies
- [Turborepo](https://turbo.build/repo) - High-performance build system for JavaScript/TypeScript monorepos
- [Next.js](https://nextjs.org/) - The React Framework for Production with App Router
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [ws](https://github.com/websockets/ws) - Simple and fast WebSocket library for Node.js
- [Zod](https://zod.dev/) - TypeScript-first schema validation with static type inference
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### Inspiration
- Collaborative drawing tools like Excalidraw and Google Jamboard
- Real-time collaboration patterns from Figma and Notion
- Monorepo architecture best practices from Vercel

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [WebSocket MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)

### Special Thanks
- To the open-source community for creating amazing tools
- Contributors and testers who help improve this project
- Everyone using CollabCanvas for learning and collaboration

---

<div align="center">

**Made with ❤️ by [Om Jaiswal](https://github.com/Omjaiswal241)**

⭐ Star this repo if you found it helpful!

[Report Bug](https://github.com/Omjaiswal241/CollabCanvas/issues) · [Request Feature](https://github.com/Omjaiswal241/CollabCanvas/issues) · [Contribute](https://github.com/Omjaiswal241/CollabCanvas/pulls)

</div>
