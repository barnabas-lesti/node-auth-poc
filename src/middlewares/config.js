// const envConfig = require('../../../config/env');

module.exports = () => (req, res, next) => {
  // Will be able to add configuration forcing here
  req.config = {};
  return next();
};
