# Contributing to CollabCanvas 🎨

Thank you for your interest in contributing to CollabCanvas! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

- **Be respectful** and inclusive in all interactions
- **Welcome newcomers** and help them get started
- **Provide constructive feedback** on code reviews
- **Focus on the code**, not the person

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 9.0.0
- **PostgreSQL** ≥ 14
- **Git**

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CollabCanvas.git
   cd CollabCanvas
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Omjaiswal241/CollabCanvas.git
   ```

### Initial Setup

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Initialize database
cd packages/db
pnpm exec prisma migrate dev
pnpm exec prisma generate
cd ../..

# Build all packages
pnpm build
```

### Running the Development Environment

```bash
# Terminal 1: Start backend services (HTTP + WebSocket)
pnpm dev

# Terminal 2: Start frontend (in separate terminal)
cd apps/collabcanvas-landing
pnpm dev
```

- Frontend: http://localhost:5173
- HTTP API: http://localhost:3001
- WebSocket: ws://localhost:8080

---

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-shape-tool`)
- `fix/` - Bug fixes (e.g., `fix/canvas-sync-issue`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/websocket-handler`)
- `test/` - Adding tests (e.g., `test/canvas-api`)

---

## Project Structure

```
CollabCanvas/
├── apps/
│   ├── collabcanvas-landing/   # Main Vite+React frontend
│   ├── http-backend/           # REST API (Express)
│   └── ws-backend/             # WebSocket server
├── packages/
│   ├── db/                     # Prisma database client
│   ├── common/                 # Shared types & schemas
│   ├── backend-common/         # Backend utilities
│   └── ui/                     # Shared UI components
├── scripts/
│   ├── test/                   # Testing scripts
│   └── setup/                  # Setup utilities
└── docs/                       # Documentation
```

### Key Files

- `turbo.json` - Turborepo build configuration
- `pnpm-workspace.yaml` - Workspace package configuration
- `packages/db/prisma/schema.prisma` - Database schema

---

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** in tsconfig.json
- **Add type annotations** for function parameters and return types
- **Avoid `any` types** - use proper types or `unknown`

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linting
pnpm lint

# Format code
pnpm format
```

### Best Practices

#### Frontend (React)
```typescript
// ✅ Good: Functional components with TypeScript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Bad: Untyped props
export const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

#### Backend (Express/WebSocket)
```typescript
// ✅ Good: Typed request handlers
import { Request, Response } from 'express';

interface CreateRoomBody {
  slug: string;
  userId: string;
}

app.post('/room', async (req: Request<{}, {}, CreateRoomBody>, res: Response) => {
  const { slug, userId } = req.body;
  // ...
});

// ❌ Bad: Untyped handlers
app.post('/room', async (req, res) => {
  const { slug, userId } = req.body; // No type safety
});
```

#### Database (Prisma)
```typescript
// ✅ Good: Type-safe queries
const user = await prismaClient.user.findUnique({
  where: { email },
  select: { id: true, name: true, email: true }
});

// ❌ Bad: Raw SQL without type safety (unless necessary)
const user = await prismaClient.$queryRaw`SELECT * FROM User WHERE email = ${email}`;
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no code change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

```bash
feat(canvas): add polygon drawing tool

- Implement polygon shape class
- Add UI button for polygon tool
- Sync polygon data via WebSocket

Closes #42
```

```bash
fix(auth): resolve JWT token expiration issue

Token was expiring too quickly due to incorrect time unit.
Changed from seconds to milliseconds.

Fixes #38
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** and ensure they pass:
   ```bash
   pnpm build
   node scripts/test/test-connection.js
   ```

3. **Check for errors**:
   ```bash
   pnpm lint
   pnpm check-types
   ```

4. **Update documentation** if needed

### Submitting a PR

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots (for UI changes)
   - Reference to related issues (`Fixes #123`)

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] All tests pass
   - [ ] Added new tests for new features
   - [ ] Manually tested in development

   ## Screenshots (if applicable)
   [Add screenshots here]

   ## Related Issues
   Fixes #123
   ```

### Review Process

- Maintainers will review your PR within 2-3 days
- Address any requested changes
- Once approved, maintainers will merge your PR

---

## Testing

### Running Tests

```bash
# Database connection test
node scripts/test/test-connection.js

# Authentication test
node scripts/test/test-signin.js

# Canvas data test
node scripts/test/test-canvas-data.js
```

### Adding Tests

When adding new features:

1. **Create test file** in `scripts/test/`
2. **Follow naming convention**: `test-<feature-name>.js`
3. **Test key functionality** including error cases
4. **Update TESTING_GUIDE.md** with new tests

Example test structure:
```javascript
import { prismaClient } from "../../packages/db/dist/index.js";

async function testNewFeature() {
  try {
    console.log('Testing new feature...');
    
    // Setup
    const testData = await createTestData();
    
    // Test
    const result = await performFeature(testData);
    
    // Verify
    console.assert(result.success, 'Feature should succeed');
    console.log('✅ Test passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prismaClient.$disconnect();
  }
}

testNewFeature();
```

---

## Reporting Issues

### Bug Reports

Include the following information:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, browser
- **Screenshots**: If applicable

### Feature Requests

- **Clear description** of the feature
- **Use case**: Why is this feature needed?
- **Proposed solution**: How might it work?
- **Alternatives**: Other approaches considered

---

## Development Tips

### Database Migrations

When modifying the database schema:

```bash
cd packages/db

# Create migration
pnpm prisma migrate dev --name descriptive_migration_name

# Review migration SQL
cat prisma/migrations/<timestamp>_descriptive_migration_name/migration.sql

# Generate Prisma client
pnpm prisma generate
```

### Debugging

#### Backend Debugging
```bash
# HTTP Backend
cd apps/http-backend
node --inspect dist/index.js

# WebSocket Backend  
cd apps/ws-backend
node --inspect dist/index.js
```

#### Frontend Debugging
Use React DevTools and browser console

#### Database Inspection
```bash
cd packages/db
pnpm prisma studio
```

### Working with Turborepo

```bash
# Build specific package
pnpm turbo build --filter=http-backend

# Run dev for specific package
pnpm turbo dev --filter=collabcanvas-landing

# Clear cache
pnpm turbo clean
```

---

## Questions?

- **Open an issue** for questions about contributing
- **Check existing issues** - your question might be answered
- **Read documentation** in the `docs/` folder

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to CollabCanvas! 🎉
