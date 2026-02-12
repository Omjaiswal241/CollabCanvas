import "dotenv/config";
import { prismaClient } from "../../packages/db/dist/index.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("Setting up database...");

// SQL to create all tables
const setupSQL = `
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Room table
CREATE TABLE IF NOT EXISTS "Room" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- Create Chat table
CREATE TABLE IF NOT EXISTS "Chat" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- Create CanvasData table
CREATE TABLE IF NOT EXISTS "CanvasData" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CanvasData_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Room_slug_key" ON "Room"("slug");

-- Add foreign keys
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Room_adminId_fkey'
    ) THEN
        ALTER TABLE "Room" ADD CONSTRAINT "Room_adminId_fkey" 
        FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Chat_roomId_fkey'
    ) THEN
        ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" 
        FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Chat_userId_fkey'
    ) THEN
        ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'CanvasData_roomId_fkey'
    ) THEN
        ALTER TABLE "CanvasData" ADD CONSTRAINT "CanvasData_roomId_fkey" 
        FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'CanvasData_userId_fkey'
    ) THEN
        ALTER TABLE "CanvasData" ADD CONSTRAINT "CanvasData_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
`;

async function setup() {
  try {
    console.log("Connecting to database...");
    await prismaClient.$connect();
    console.log("✓ Connected successfully!");

    console.log("\nCreating tables...");
    await prismaClient.$executeRawUnsafe(setupSQL);
    console.log("✓ Database tables created successfully!");

    console.log("\nVerifying tables...");
    const tables = await prismaClient.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    console.log("✓ Tables found:", tables.map(t => t.table_name).join(", "));

    console.log("\n✓ Database setup complete!");
  } catch (error) {
    console.error("✗ Setup failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

setup();
