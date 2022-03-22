const userService = require('../services/userService');

const signUp = async (req, res) => {
  try {
    console.log('controller');
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('KEY_ERROR');
      err.statusCode = 400;
      throw err;
    }

    const user = await userService.signUp(email, password);

    console.log('right before send response');

    return res.status(201).json({
      message: 'SIGNUP_SUCCESS',
      user_id: user.id,
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { signUp };
