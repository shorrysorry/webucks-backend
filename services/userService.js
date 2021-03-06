const userDao = require('../models/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (email, password) => {
  if (password.length < 8) {
    const err = new Error('PASSWORD_TOO_SHORT');
    err.statusCode = 400;
    throw err;
  }

  const userEmail = await userDao.getUserEmailByEmail(email);

  if (userEmail.length) {
    const err = new Error('EXSITING_USER');
    err.statusCode = 409;
    throw err;
  }

  const encryptPw = bcrypt.hashSync(password, bcrypt.genSaltSync());

  const encryptUser = await userDao.createUser(email, encryptPw);

  return encryptUser;
};

const checkValid = async (email, password) => {
  const userEmail = await userDao.getUserEmailByEmail(email);
  if (!userEmail.length) {
    const err = new Error('INVALID_USER');
    err.statusCode = 400;
    throw err;
  }
  const userPw = await userDao.getUserPwByEmail(email);
  const isSamePw = bcrypt.compareSync(password, userPw[0]['password']);

  if (!isSamePw) {
    const err = new Error('INVALID_USER');
    err.statusCode = 400;
    throw err;
  }
};

const logIn = async (email, password) => {
  checkValid(email, password);

  const user = { user_id: email };
  const token = jwt.sign(user, process.env.SECRET_KEY);

  return token;
};

const changePw = async (email, password, newPassword) => {
  checkValid(email, password);

  if (password === newPassword) {
    const err = new Error('SAME_PASSWORD');
    err.statusCode = 400;
    throw err;
  }

  const encryptPw = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());

  const updatePw = await userDao.updateNewPw(email, encryptPw);

  return updatePw;
};

module.exports = { signUp, logIn, changePw };
