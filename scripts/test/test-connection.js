import "dotenv/config";
import { prismaClient } from "../../packages/db/dist/index.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("Testing connection...");

prismaClient.$connect()
  .then(() => {
    console.log("✓ Successfully connected to database!");
    return prismaClient.user.findMany();
  })
  .then((users) => {
    console.log("✓ Found", users.length, "users");
    return prismaClient.$disconnect();
  })
  .catch((error) => {
    console.error("✗ Connection failed:", error.message);
    console.error("Error code:", error.code);
    process.exit(1);
  });
