import "dotenv/config";
import { prismaClient } from "./packages/db/dist/index.js";

console.log("Adding missing CanvasData table...\n");

async function addCanvasDataTable() {
  try {
    await prismaClient.$connect();
    console.log("✓ Connected\n");
    
    // Create CanvasData table
    console.log("Creating CanvasData table...");
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
    console.log("✓ CanvasData table created");
    
    // Add foreign keys
    console.log("\nAdding foreign key constraints...");
    try {
      await prismaClient.$executeRaw`
        ALTER TABLE "CanvasData" 
        ADD CONSTRAINT "CanvasData_roomId_fkey" 
        FOREIGN KEY ("roomId") REFERENCES "Room"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE`;
      console.log("✓ Added CanvasData -> Room foreign key");
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log("✓ CanvasData -> Room foreign key already exists");
      } else {
        throw e;
      }
    }
    
    try {
      await prismaClient.$executeRaw`
        ALTER TABLE "CanvasData" 
        ADD CONSTRAINT "CanvasData_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE`;
      console.log("✓ Added CanvasData -> User foreign key");
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log("✓ CanvasData -> User foreign key already exists");
      } else {
        throw e;
      }
    }
    
    // Verify all tables
    console.log("\nVerifying all tables...");
    const tables = await prismaClient.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name`;
    console.log("✓ Tables:", tables.map(t => t.table_name).join(", "));
    
    // Test counting records
    console.log("\nTesting database operations...");
    const userCount = await prismaClient.user.count();
    const roomCount = await prismaClient.room.count();
    const chatCount = await prismaClient.chat.count();
    const canvasCount = await prismaClient.canvasData.count();
    
    console.log(`✓ Users: ${userCount}`);
    console.log(`✓ Rooms: ${roomCount}`);
    console.log(`✓ Chats: ${chatCount}`);
    console.log(`✓ Canvas Data: ${canvasCount}`);
    
    console.log("\n✅ Database is fully set up and ready to use!");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code) console.error("   Code:", error.code);
    console.error(error);
  } finally {
    await prismaClient.$disconnect();
  }
}

addCanvasDataTable();
