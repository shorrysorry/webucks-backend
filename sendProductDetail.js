const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendProductDetail = async (req, res) => {
  try {
    const productsDetails = await prisma.$queryRaw`
      SELECT 
        p.id AS id,
        p.korean_name AS koreanName,
        p.english_name AS englishName,
        c.name AS categoryName,
        i.image_url AS imageUrl,
        JSON_ARRAYAGG(a.name) AS allergies,
        JSON_OBJECT('caffeine', n.caffeine, 'fat', n.fat, 'sugar', n.sugar, 'sodium', n.sodium)
        AS nutritions
      FROM products AS p
      LEFT JOIN categories AS c ON p.category_id = c.id
      LEFT JOIN product_images AS i ON p.id = i.product_id
      LEFT JOIN products_allergies AS pa ON pa.product_id = p.id
      LEFT JOIN allergies AS a ON pa.allergy_id = a.id
      LEFT JOIN nutritions AS n ON n.product_id = p.id
      GROUP BY p.id, c.name, i.image_url, n.caffeine, n.fat, n.sugar, n.sodium
    `;
    return res.status(200).json({ productsDetails });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { sendProductDetail };
