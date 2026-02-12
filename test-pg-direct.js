import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;

console.log("Testing direct PostgreSQL connection...\n");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  query_timeout: 10000,
});

async function test() {
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("✓ Connected!");
    
    console.log("\nTesting simple query...");
    const result = await client.query("SELECT NOW() as time, version() as version");
    console.log("✓ Query successful!");
    console.log("  Server time:", result.rows[0].time);
    console.log("  PostgreSQL version:", result.rows[0].version.substring(0, 50) + "...");
    
    console.log("\nChecking existing tables...");
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log("✓ Existing tables found:", tables.rows.map(t => t.table_name).join(", "));
    } else {
      console.log("  No tables found - database is empty");
    }
    
    console.log("\n✅ Direct connection works! The database is accessible.");
    
  } catch (error) {
    console.error("\n❌ Connection failed!");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    
    if (error.code === 'ETIMEDOUT') {
      console.error("\n⚠️  The database is not responding. Please:");
      console.error("   1. Visit https://console.neon.tech/app/projects");
      console.error("   2. Check if your project exists and is active");
      console.error("   3. Get a fresh connection string");
    }
  } finally {
    await client.end();
  }
}

test();
