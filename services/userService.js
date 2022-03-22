const userDao = require('../models/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (email, password) => {
  console.log('right before checking password (service)');
  if (password.length < 8) {
    const err = new Error('PASSWORD_TOO_SHORT');
    err.statusCode = 400;
    throw err;
  }

  const userEmail = await userDao.getUserByEmail(email);
  console.log('right after come back to dao1');

  if (userEmail.length) {
    const err = new Error('EXSITING_USER');
    err.statusCode = 409;
    throw err;
  }

  const encryptPw = bcrypt.hashSync(password, bcrypt.genSaltSync());

  const encryptUser = await userDao.createUser(email, encryptPw);
  console.log('right after come back to dao2');

  return encryptUser;
};

module.exports = { signUp };
