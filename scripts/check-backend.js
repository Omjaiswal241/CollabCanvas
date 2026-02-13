// Quick diagnostic script to check if backend is running
const HTTP_BACKEND = "http://localhost:3001";

async function checkBackend() {
  console.log("🔍 Checking if HTTP backend is running...\n");
  
  try {
    const response = await fetch(`${HTTP_BACKEND}/chats/1`);
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Backend is running on port 3001");
      console.log("✅ Database connection is working");
      console.log("\n📝 Your setup looks good! Try signing up now.\n");
    } else {
      console.log("⚠️  Backend responded but with an error");
      console.log("Response:", data);
    }
  } catch (error) {
    console.log("❌ Cannot connect to backend at", HTTP_BACKEND);
    console.log("\n📋 Make sure you:");
    console.log("  1. Have a .env file with DATABASE_URL configured");
    console.log("  2. Ran 'npx prisma migrate dev' in packages/db");
    console.log("  3. Started the backend: cd apps/http-backend && npm run dev");
    console.log("\nError:", error.message);
  }
}

checkBackend();
