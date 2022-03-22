const http = require('http');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes');

const prisma = new PrismaClient();

const app = express();

app.use(routes);
app.use(express.json());

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

// user/login POST : LOGIN API
app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const keys = Object.keys(req.body);

    // key 값 존재하는지 확인
    if (!keys.includes('email') || !keys.includes('password')) {
      const err = new Error('KEY_ERROR');
      err.statusCode = 400;
      throw err;
    }

    const isValidEmail = await prisma.$queryRaw`
      SELECT email FROM users WHERE email=${email}
    `;

    // 가입되어 있는 id 인지 확인
    if (!isValidEmail[0]) {
      const err = new Error('INVALID_USER');
      err.statusCode = 400;
      throw err;
    }

    const myPw = await prisma.$queryRaw`
      SELECT password FROM users WHERE email=${email}
    `;
    const isValidPw = bcrypt.compareSync(password, myPw[0]['password']);

    // pw 가 일치 하는지
    if (!isValidPw) {
      const err = new Error('INVALID_USER');
      err.statusCode = 400;
      throw err;
    }

    const user = { user_id: email };
    const token = jwt.sign(user, process.env.SECRET_KEY);
    return res.status(201).json({ message: 'LOGIN_SUCCESS', jwt: token });
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
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
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
