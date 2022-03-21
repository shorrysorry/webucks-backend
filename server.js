const http = require('http');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // for parsing application/json

// products/categories GET : COFFEE CATEGORIES 호출 API
app.get('/products/categories', async (req, res) => {
  const categoreis = await prisma.$queryRaw`
    SELECT * FROM categories
    `;
  return res.json(categoreis);
});

// products GET : COFFEE PRODUCTS 호출 API
app.get('/products', async (req, res) => {
  const products = await prisma.$queryRaw`
    SELECT * FROM products
    `;
  return res.json(products);
});

// products/2 GET : COFFEE DETAILS 호출 API
app.get('/products/2', async (req, res) => {
  const productsDetails = await prisma.$queryRaw`
    SELECT p.id, p.korean_name, p.english_name, c.name AS category_name, i.image_url,
    CONCAT('[', GROUP_CONCAT(a.name), ']') AS allergies,
    JSON_OBJECT('caffeine', n.caffeine, 'fat', n.fat, 'sugar', n.sugar, 'sodium', n.sodium) AS nutritions
    FROM products AS p
    LEFT JOIN categories AS c ON p.category_id = c.id
    LEFT JOIN product_images AS i ON p.id = i.product_id
    LEFT JOIN products_allergies AS pa ON pa.product_id = p.id
    LEFT JOIN allergies AS a ON pa.allergy_id = a.id
    LEFT JOIN nutritions AS n ON n.product_id = p.id
    GROUP BY p.id, c.name, i.image_url, n.caffeine, n.fat, n.sugar, n.sodium
  `;
  return res.json(productsDetails);
});

// users/signup POST : SIGNUP API
app.post('/users/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const keys = Object.keys(req.body);
    const isDuplicated = await prisma.$queryRaw`
      SELECT email FROM users WHERE email=${email}
    `;
    if (keys.includes('email') && keys.includes('password')) {
      if (password.length >= 8 && !isDuplicated[0]) {
        const encryptPw = bcrypt.hashSync(password, bcrypt.genSaltSync());
        const createUser = await prisma.$queryRaw`
          INSERT INTO users(email, password) VALUES (${email}, ${encryptPw});
          `;
        return res.status(201).json({ message: 'SIGNUP_SUCCESS' });
      } else if (isDuplicated[0]) {
        const err = new Error('EXSITING_USER');
        err.statusCode = 409;
        throw err;
      } else if (password.length < 8) {
        const err = new Error('PASSWORD_TOO_SHORT');
        err.statusCode = 400;
        throw err;
      }
    } else {
      const err = new Error('KEY_ERROR');
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
});

// user/login POST : LOGIN API
app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const keys = Object.keys(req.body);
    const isValidEmail = await prisma.$queryRaw`
      SELECT email FROM users WHERE email=${email}
    `;
    const myPw = await prisma.$queryRaw`
      SELECT password FROM users WHERE email=${email}
    `;
    if (keys.includes('email') && keys.includes('password')) {
      const isValidPw = bcrypt.compareSync(password, myPw[0]['password']);
      if (isValidEmail[0] && isValidPw) {
        const user = { user_id: email };
        const token = jwt.sign(user, 'shorry_key');
        return res.status(201).json(jwt.verify(token, 'shorry_key'));
      } else {
        const err = new Error('INVALID_USER');
        err.statusCode = 400;
        throw err;
      }
    } else {
      const err = new Error('KEY_ERROR');
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
});

// users GET : USERS 호출 API
app.get('/users', async (req, res) => {
  const signupUserDatas = await prisma.$queryRaw`
    SELECT * FROM users
  `;
  return res.json(signupUserDatas);
});

// users POST : PW CHANGE API
app.post('/users', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('email: ', email, 'newPw: ', newPassword);
    const isValidEmail = await prisma.$queryRaw`
      SELECT email FROM users WHERE email=${email}
    `;
    if (isValidEmail[0]) {
      await prisma.$queryRaw`
      UPDATE users SET password=${newPassword} WHERE email=${email}
    `;
      return res.status(201).json({ message: 'PASSWORD IS CHANGED' });
    } else {
      return res.status(400).json({ message: 'EMAIL IS NOT VALID' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

// islike POST : IS LIKE API
app.post('/islike', async (req, res) => {
  const { productId } = req.body;
  if (boolean) {
    await prisma.$queryRaw`
    UPDATE is_likes SET is_like=0 WHERE product_id=${productId}
    `;
  } else {
    await prisma.$queryRaw`
    UPDATE is_likes SET is_like=1 WHERE product_id=${productId}
    `;
  }

  const isLike = await prisma.$queryRaw`
    SELECT product_id, is_like FROM is_likes WHERE id=${productId}
    `;

  return res.json(isLike);
});

// CREATE SERVER
const server = http.createServer(app);

// SERVER START
const start = async () => {
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`));
  } catch (err) {
    console.error(err);
    // await prisma.$disconnect() // 에러 발생 시 database 연결 종료
  }
};

start();
