const { PrismaClient } = require('@prisma/client');

async function testSignin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking users in database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    });
    
    console.log('\n=== Users in Database ===');
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Password (hashed): ${user.password}`);
      console.log('---');
    });
    
    if (users.length === 0) {
      console.log('No users found in database!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignin();
