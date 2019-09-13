const logger = require('../../../common/logger');
const auth = require('../../../services/auth');
const User = require('../../../models/user');

module.exports = {
  async post (req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    try {
      const user = await User.findOne({ email });
      if (user && await auth.comparePasswords(password, user.passwordHash)) {
        res.set(auth.HTTP_HEADER_NAME, await auth.createAuthorizationHeaderStringFromUser(user));
        return res.sendStatus(200);
      }

      return res.sendStatus(401);
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
