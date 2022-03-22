const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategories = async () => {
  return await prisma.$queryRaw`
      SELECT id, name FROM categories ORDER BY id
      `;
};

const getLists = async () => {
  return await prisma.$queryRaw`
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
};

const getDetail = async () => {
  return await prisma.$queryRaw`
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
};

module.exports = { getCategories, getLists, getDetail };
