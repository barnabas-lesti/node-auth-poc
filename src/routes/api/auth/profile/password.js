const logger = require('../../../../common/logger');
const User = require('../../../../models/user');
const auth = require('../../../../services/auth');

module.exports = {
  async patch (req, res) {
    if (!req.user) return res.sendStatus(401);

    const { password } = req.body;
    if (!password) return res.sendStatus(400);

    try {
      const passwordHash = await auth.hashPassword(password);
      await User.update({ email: req.user.email }, { passwordHash });
      return res.sendStatus(200);
    } catch (error) {
      if (error.code === 11000) return res.sendStatus(409);

      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
