const http = require('http');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes');

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.json({ message: '/ endpoint' });
});

//
//
//
//
//
//
//

// users GET : USERS 호출 API
app.get('/users', async (req, res) => {
  const signupUserDatas = await prisma.$queryRaw`
    SELECT * FROM users
  `;
  return res.json(signupUserDatas);
});

// islike POST : IS LIKE API
app.post('/islike', async (req, res) => {
  const { productId } = req.body;
  const isLiked = await prisma.$queryRaw`
    SELECT is_like FROM is_likes WHERE product_id=${productId}
  `;

  await prisma.$queryRaw`
    UPDATE is_likes SET is_like=${isLiked ? 0 : 1} WHERE product_id=${productId}
  `;

  const changedLike = await prisma.$queryRaw`
    SELECT product_id, is_like FROM is_likes WHERE id=${productId}
  `;

  return res.json({ changedLike });
});

//
//
//
//
//

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
