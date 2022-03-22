const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendProductLists = async (req, res) => {
  try {
    const products = await prisma.$queryRaw`
      SELECT
        p.id AS id,
        p.korean_name AS koreanName,
        p.english_name AS englishName,
        c.name AS categoryName,
        c.id AS categoryId,
        i.image_url AS imageUrl
      FROM products AS p
      JOIN categories AS c ON p.category_id = c.id
      JOIN product_images AS i ON i.product_id = p.id
      `;
    return res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { sendProductLists };
