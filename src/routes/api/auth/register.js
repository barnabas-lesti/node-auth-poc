const { config, logger } = require('../../../common');
const { auth } = require('../../../services');
const { User } = require('../../../models');

module.exports = {
  async post (req, res) {
    if (config.AUTH_REGISTRATION_DISABLED) return res.sendStatus(403);

    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) return res.sendStatus(400);

    try {
      const passwordHash = await auth.hashPassword(password);
      await User.create({ email, passwordHash, fullName });
      return res.sendStatus(200);
    } catch (error) {
      if (error.code === 11000) return res.sendStatus(409);

      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
