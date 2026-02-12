import "dotenv/config";
import { prismaClient } from "./packages/db/dist/index.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set (using connection pooler)" : "Not set");
console.log("\nAttempting to wake up Neon database...");
console.log("(Neon free tier databases suspend after inactivity and may take 10-30 seconds to wake up)\n");

async function setupDatabase() {
  let retries = 5;
  let delay = 5000; // Start with 5 seconds

  while (retries > 0) {
    try {
      console.log(`Attempt ${6 - retries}/5: Connecting...`);
      await prismaClient.$connect();
      console.log("✓ Connected!");
      
      // Try a simple query to verify connection
      console.log("Testing query...");
      const result = await prismaClient.$queryRaw`SELECT NOW()`;
      console.log("✓ Database is responsive!");
      
      // Create tables one by one
      console.log("\n Creating tables...");
      
      // User table
      console.log("  → Creating User table...");
      await prismaClient.$executeRaw`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "photo" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        )`;
      await prismaClient.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`;
      console.log("  ✓ User table created");
      
      // Room table
      console.log("  → Creating Room table...");
      await prismaClient.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Room" (
          "id" SERIAL NOT NULL,
          "slug" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "adminId" TEXT NOT NULL,
          CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
        )`;
      await prismaClient.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Room_slug_key" ON "Room"("slug")`;
      console.log("  ✓ Room table created");
      
      // Chat table
      console.log("  → Creating Chat table...");
      await prismaClient.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Chat" (
          "id" SERIAL NOT NULL,
          "roomId" INTEGER NOT NULL,
          "message" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
        )`;
      console.log("  ✓ Chat table created");
      
      // CanvasData table
      console.log("  → Creating CanvasData table...");
      await prismaClient.$executeRaw`
        CREATE TABLE IF NOT EXISTS "CanvasData" (
          "id" SERIAL NOT NULL,
          "roomId" INTEGER NOT NULL,
          "userId" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "data" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "CanvasData_pkey" PRIMARY KEY ("id")
        )`;
      console.log("  ✓ CanvasData table created");
      
      // Add foreign keys
      console.log("\n  → Adding foreign key constraints...");
      try {
        await prismaClient.$executeRaw`
          ALTER TABLE "Room" 
          ADD CONSTRAINT IF NOT EXISTS "Room_adminId_fkey" 
          FOREIGN KEY ("adminId") REFERENCES "User"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE`;
      } catch (e) {
        if (!e.message.includes("already exists")) throw e;
      }
      
      try {
        await prismaClient.$executeRaw`
          ALTER TABLE "Chat" 
          ADD CONSTRAINT IF NOT EXISTS "Chat_roomId_fkey" 
          FOREIGN KEY ("roomId") REFERENCES "Room"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE`;
      } catch (e) {
        if (!e.message.includes("already exists")) throw e;
      }
      
      try {
        await prismaClient.$executeRaw`
          ALTER TABLE "Chat" 
          ADD CONSTRAINT IF NOT EXISTS "Chat_userId_fkey" 
          FOREIGN KEY ("userId") REFERENCES "User"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE`;
      } catch (e) {
        if (!e.message.includes("already exists")) throw e;
      }
      
      try {
        await prismaClient.$executeRaw`
          ALTER TABLE "CanvasData" 
          ADD CONSTRAINT IF NOT EXISTS "CanvasData_roomId_fkey" 
          FOREIGN KEY ("roomId") REFERENCES "Room"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE`;
      } catch (e) {
        if (!e.message.includes("already exists")) throw e;
      }
      
      try {
        await prismaClient.$executeRaw`
          ALTER TABLE "CanvasData" 
          ADD CONSTRAINT IF NOT EXISTS "CanvasData_userId_fkey" 
          FOREIGN KEY ("userId") REFERENCES "User"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE`;
      } catch (e) {
        if (!e.message.includes("already exists")) throw e;
      }
      console.log("  ✓ Foreign keys added");
      
      // Verify setup
      console.log("\n  → Verifying tables...");
      const tables = await prismaClient.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name`;
      console.log("  ✓ Tables:", tables.map(t => t.table_name).join(", "));
      
      console.log("\n✅ Database setup complete!");
      await prismaClient.$disconnect();
      return;
      
    } catch (error) {
      retries--;
      console.error(`✗ Attempt failed: ${error.message}`);
      
      if (error.code === 'ETIMEDOUT') {
        if (retries > 0) {
          console.log(`   Waiting ${delay/1000} seconds before retry... (${retries} attempts remaining)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * 1.5, 30000); // Increase delay, max 30s
        } else {
          console.error("\n❌ Failed after all retries.");
          console.error("\nPossible issues:");
          console.error("1. Neon database is suspended and taking too long to wake up");
          console.error("2. Network/firewall blocking the connection");
          console.error("3. Invalid connection string");
          console.error("\nTry:");
          console.error("- Visit your Neon dashboard and wake the database manually");
          console.error("- Use the direct connection string instead of pooler");
          console.error("- Check https://console.neon.tech/app/projects");
          process.exit(1);
        }
      } else {
        console.error("Error details:", error);
        await prismaClient.$disconnect();
        process.exit(1);
      }
    }
  }
}

setupDatabase();
