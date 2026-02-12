# Changelog

All notable changes to CollabCanvas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-12

### 🎉 Initial Release

#### Added
- **Real-time Collaborative Drawing**
  - 5 drawing tools: Pencil, Rectangle, Circle, Eraser, Text
  - Instant synchronization across all connected users
  - Canvas persistence with PostgreSQL database
  - Shape erase tracking and hover highlighting

- **Authentication System**
  - User signup and signin with JWT tokens
  - Secure password hashing using bcrypt
  - Session management with localStorage
  - Protected routes requiring authentication

- **Room Management**
  - Create uniquely named collaborative rooms
  - Join existing rooms using room slugs
  - Quick start with random room names
  - Room list for created rooms
  - Admin controls (clear canvas, clear chat)

- **Real-time Chat**
  - Send messages within rooms
  - Chat history persistence
  - User identification in messages
  - Admin clear chat functionality

- **Database Schema**
  - User model with credentials
  - Room model for collaboration spaces
  - Chat model with timestamps
  - CanvasData model for drawing persistence

- **Project Infrastructure**
  - Turborepo monorepo setup
  - pnpm workspace configuration
  - TypeScript across all packages
  - Shared packages (db, common, ui, backend-common)
  - Organized scripts (test/, setup/)
  - Comprehensive documentation

#### Technical Stack
- **Frontend**: React 19, Vite 5, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, WebSocket (ws), JWT, bcrypt
- **Database**: PostgreSQL 14+, Prisma ORM
- **Build**: Turborepo, pnpm workspaces

#### Documentation
- README.md with comprehensive setup guide
- BACKEND_INTEGRATION.md for API documentation
- SETUP_GUIDE.md for detailed installation
- TESTING_GUIDE.md for testing procedures
- MIGRATION.md for database migrations
- CONTRIBUTING.md for contribution guidelines

### Security
- ✅ Implemented bcrypt password hashing (rounds: 10)
- ✅ JWT token-based authentication
- ✅ CORS configuration for API security
- ✅ Environment variables for sensitive data

---

## [Unreleased]

### Planned Features
- [ ] Password reset functionality
- [ ] Email verification
- [ ] User profile editing
- [ ] Room permissions and roles
- [ ] Additional drawing tools (Line, Arrow, Polygon)
- [ ] Color picker and stroke width customization
- [ ] Canvas export (PNG, SVG)
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle
- [ ] Video/audio chat integration

---

## Version History

### Version Format
- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Change Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

[1.0.0]: https://github.com/Omjaiswal241/CollabCanvas/releases/tag/v1.0.0
