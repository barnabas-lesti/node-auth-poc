const { authService } = require('../services');

module.exports = () => async (req, res, next) => {
  const authHeaderString = req.header('Authorization') || '';
  if (!authHeaderString) return next();

  const verificationResult = await Auth.verifyAuthorizationHeaderString(authHeaderString);
  if (!verificationResult) return next();

  const { newHeaderString, payload } = verificationResult;
  res.set('Authorization', newHeaderString || authHeaderString);

  req.user = payload;
  return next();
};
