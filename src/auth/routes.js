const auth = require('./index');
const UserDao = require('./user.dao');
const { config, mail, logger } = require('../common');

module.exports = (router) => {
  router.route('/auth/register')
    .post(async (req, res) => {
      if (config.REGISTRATION_DISABLED) return res.sendStatus(403);

      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName) return res.sendStatus(400);

      try {
        const passwordHash = await auth.hashPassword(password);
        await UserDao.create({ email, passwordHash, fullName });
        return res.sendStatus(200);
      } catch (error) {
        if (error.code === 11000) return res.sendStatus(409);

        logger.error(error);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/sign-in')
    .post(async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) return res.sendStatus(400);

      try {
        const user = await UserDao.findOne({ email });
        if (user && await auth.comparePasswords(password, user.passwordHash)) {
          const { accessToken, refreshToken } = await auth.createAccessAndRefreshTokens(user);
          res.set('Authorization', Auth.createAuthorizationHeaderString(accessToken, refreshToken));
          return res.sendStatus(200);
        }

        return res.sendStatus(401);
      } catch (error) {
        logger.error(error);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/verify')
    .post((req, res) => {
      return res.send(req.user);
    });

  // router.route('/auth/send-registration-email')
  //   .post(async (req, res) => {
  //     if (envConfig.REGISTRATION_DISABLED) return res.sendStatus(403);

  //     const { email, password, fullName, locale = envConfig.I18N_DEFAULT_LOCALE } = req.body;
  //     if (!email || !password || !fullName) return res.sendStatus(400);

  //     const user = await User.findOne({ email });
  //     if (user) return res.sendStatus(409);

  //     const expiresInMinutes = envConfig.EMAIL_TOKEN_EXPIRATION_IN_MINUTES;
  //     try {
  //       const token = await User.createRegistrationToken({ email, password, fullName });
  //       const link = encodeURI(`${envConfig.BASE_URL}/${locale}/register?token=${token}`);
  //       try {
  //         const verificationMail = new Mail(email, locale, Mail.Templates.REGISTRATION, { link, expiresInMinutes });
  //         await verificationMail.send();
  //         return res.sendStatus(200);
  //       } catch (mailError) {
  //         return res.sendStatus(400);
  //       }
  //     } catch (unknownError) {
  //       Logger.error(unknownError);
  //       return res.sendStatus(500);
  //     }
  //   });

  router.route('/auth/emails/password-reset')
    .post(async (req, res) => {
      const { email, redirectUrl, locale = 'en' } = req.body;
      if (!email || !redirectUrl) return res.sendStatus(400);

      const user = await UserDao.findOne({ email });
      if (!user) return res.sendStatus(404);

      try {
        const token = await auth.createEmailToken({ email });
        const link = encodeURI(`${redirectUrl}?token=${token}`);
        try {
          const passwordResetMail = new Mail(email, locale, Mail.Templates.PASSWORD_RESET, { link });
          await passwordResetMail.send();
          return res.sendStatus(200);
        } catch (mailError) {
          return res.sendStatus(400);
        }
      } catch (error) {
        Logger.error(error);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/password')
    .patch(async (req, res) => {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return res.sendStatus(400);

      const verificationResult = await Auth.verifyPasswordResetToken(token);
      if (!verificationResult) return res.sendStatus(401);
      const { email } = verificationResult;

      const user = await User.findOne({ email });
      if (!user) return res.sendStatus(404);

      try {
        const passwordHash = await Auth.hashPassword(newPassword);
        await User.findOneAndUpdate({ email }, { passwordHash });
        return res.sendStatus(200);
      } catch (error) {
        Logger.error(error);
        return res.sendStatus(500);
      }
    });

  // router.route('/auth/profile')
  //   .patch(async (req, res) => {
  //     const { user, body } = req;
  //     if (!user) return res.sendStatus(401);
  //     if (!body.fullName) return res.sendStatus(400);

  //     try {
  //       await User.findOneAndUpdate({ _id: user._id }, body);
  //       return res.sendStatus(200);
  //     } catch (unknownError) {
  //       Logger.error(unknownError);
  //       return res.sendStatus(500);
  //     }
  //   });

  return router;
};
