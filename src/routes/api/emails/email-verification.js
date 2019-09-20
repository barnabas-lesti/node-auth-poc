const config = require('../../../common/config');
// const emailSvc = require('../../../services/email');
// const User = require('../../../models/user');

module.exports = {
  async post (req, res) {
    const { email, locale = config.DEFAULT_LOCALE } = req.body;
    if (!email) return res.sendStatus(400);

    // emailSvc.sendEmailVerification(email, locale);

    return res.sendStatus(200);
  },
};
