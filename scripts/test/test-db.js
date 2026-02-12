import { prismaClient } from "../../packages/db/dist/index.js";

console.log("Prisma client loaded successfully!");
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const checkUsers = async () => {
    try {
        const users = await prismaClient.user.findMany();
        console.log("\n📊 Users in database:", users.length);
        console.log(users);
        await prismaClient.$disconnect();
    } catch (error) {
        console.error("Error checking database:", error);
        await prismaClient.$disconnect();
    }
};

checkUsers();
