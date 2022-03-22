const userService = require('../services/userService');

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('KEY_ERROR');
      err.statusCode = 400;
      throw err;
    }

    const user = await userService.signUp(email, password);

    return res.status(201).json({
      message: 'SIGNUP_SUCCESS',
      user_id: user.id,
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('KEY_ERROR');
      err.statusCode = 400;
      throw err;
    }

    const userToken = await userService.logIn(email, password);

    return res.status(201).json({ message: 'LOGIN_SUCCESS', jwt: userToken });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { signUp, logIn };
