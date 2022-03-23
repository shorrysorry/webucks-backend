const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserEmailByEmail = async (email) => {
  return await prisma.$queryRaw`
        SELECT email FROM users WHERE email=${email}
      `;
};

const getUserPwByEmail = async (email) => {
  return await prisma.$queryRaw`
      SELECT password FROM users WHERE email=${email}
    `;
};

const createUser = async (email, encryptPw) => {
  return await prisma.$queryRaw`
      INSERT INTO users(email, password) VALUES (${email}, ${encryptPw});
      `;
};

const updateNewPw = async (email, encryptPw) => {
  return await prisma.$queryRaw`
    UPDATE users SET password=${encryptPw} WHERE email=${email}
    `;
};

module.exports = {
  getUserEmailByEmail,
  getUserPwByEmail,
  createUser,
  updateNewPw,
};
