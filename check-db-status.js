import "dotenv/config";
import { prismaClient } from "./packages/db/dist/index.js";

console.log("Checking database status...\n");

async function checkDatabase() {
  try {
    // Quick connection test
    await prismaClient.$connect();
    console.log("✓ Database connected\n");
    
    // Check if tables exist
    console.log("Checking for existing tables...");
    const tables = await prismaClient.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    if (tables && tables.length > 0) {
      console.log("✅ Database already has tables!");
      console.log("   Tables found:", tables.map(t => t.table_name).join(", "));
      
      // Check if our expected tables exist
      const tableNames = tables.map(t => t.table_name.toLowerCase());
      const expected = ['user', 'room', 'chat', 'canvasdata'];
      const hasAll = expected.every(t => tableNames.includes(t));
      
      if (hasAll) {
        console.log("\n✅ All required tables exist! Database is ready to use.");
        
        // Quick count check
        try {
          const userCount = await prismaClient.user.count();
          const roomCount = await prismaClient.room.count();
          console.log(`\n   Users: ${userCount}`);
          console.log(`   Rooms: ${roomCount}`);
        } catch (e) {
          console.log("\n   (Could not query counts, but tables exist)");
        }
      } else {
        console.log("\n⚠️  Some tables are missing. Expected:", expected.join(", "));
      }
    } else {
      console.log("❌ No tables found. Database needs to be set up.");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code) console.error("   Code:", error.code);
  } finally {
    await prismaClient.$disconnect();
  }
}

checkDatabase();
