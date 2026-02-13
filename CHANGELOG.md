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

## [1.1.0] - 2026-02-13

### Added
- **Additional Drawing Tools**
  - Line tool for straight lines
  - Triangle tool for isosceles triangles
  - Total of 7 drawing tools now available

- **Real-time Collaboration**
  - Canvas polling mechanism (1.5s interval) for shape synchronization
  - Smart shape merging to avoid duplicates
  - Automatic deletion sync across all users
  - Database-backed persistence with unique IDs

- **New API Endpoint**
  - `DELETE /canvas/:roomId/:canvasId` - Delete specific shapes by ID
  - Enables precise shape deletion with database sync

### Fixed
- **Eraser Persistence Bug**
  - Erased shapes now properly delete from database
  - Shapes no longer reappear after page refresh
  - Deletions automatically sync to other users (within 1.5s)

### Changed
- **Major Code Refactoring**
  - Restructured frontend into modular architecture
  - Room.tsx reduced from 908 lines to 140 lines
  - New folder structure:
    - `types/` - Centralized TypeScript interfaces
    - `services/` - API layer separation
    - `hooks/` - Custom React hooks for business logic
    - `utils/` - Pure utility functions
    - `components/room/` - Reusable room components
  - Improved maintainability and testability
  - Better separation of concerns

- **Enhanced Documentation**
  - Updated README with new architecture details
  - Added modular architecture benefits section
  - Updated API reference with new endpoints
  - Comprehensive drawing tools guide

### Technical Improvements
- Layer-based architecture (Pages → Hooks → Services → Utils)
- Improved type safety with centralized interfaces
- Better code reusability across components
- Easier testing with decoupled modules

---

## [Unreleased]

### Planned Features
- [ ] WebSocket broadcasting for instant updates (replace polling)
- [ ] Freehand pencil stroke persistence
- [ ] Password reset functionality
- [ ] Email verification
- [ ] User profile editing
- [ ] Room permissions and roles
- [ ] Color picker and stroke width customization
- [ ] Undo/redo functionality
- [ ] Shape editing and moving
- [ ] Canvas export (PNG, SVG)
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle
- [ ] User presence indicators
- [ ] Cursor tracking for other users

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
