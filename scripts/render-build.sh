#!/usr/bin/env bash
# Helper script for Render builds to ensure dev deps (prisma) are available
set -euo pipefail

echo "Installing all dependencies (including dev)"
pnpm install --prod=false

echo "Generating Prisma client"
cd packages/db
npx prisma generate
cd -

echo "Building http-backend and ws-backend"
pnpm --filter http-backend run build
pnpm --filter ws-backend run build

echo "Build complete"
