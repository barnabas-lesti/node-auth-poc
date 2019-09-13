const auth = require('../services/auth');

module.exports = () => async (req, res, next) => {
  const authHeaderString = req.header('Authorization') || '';
  if (!authHeaderString) return next();

  const verificationResult = await auth.verifyAuthorizationHeaderString(authHeaderString);
  if (!verificationResult) return next();

  const { newHeaderString, payload } = verificationResult;
  res.set(auth.HTTP_HEADER_NAME, newHeaderString || authHeaderString);

  req.user = payload;
  return next();
};
