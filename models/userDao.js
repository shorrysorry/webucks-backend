const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserByEmail = async (email) => {
  console.log('dao1');
  return await prisma.$queryRaw`
        SELECT email FROM users WHERE email=${email}
      `;
};

const createUser = async (email, encryptPw) => {
  console.log('dao2');
  return await prisma.$queryRaw`
      INSERT INTO users(email, password) VALUES (${email}, ${encryptPw});
      `;
};

module.exports = { getUserByEmail, createUser };
