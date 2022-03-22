const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendCategories = async (req, res) => {
  try {
    const categoreis = await prisma.$queryRaw`
      SELECT id, name FROM categories ORDER BY id
      `;
    return res.status(200).json({ categoreis });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { sendCategories };
