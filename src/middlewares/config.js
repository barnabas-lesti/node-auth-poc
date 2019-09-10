// const { config } = require('../common');

module.exports = () => (req, res, next) => {
  // TODO: Implement context based config resolution (config forcing, override, etc.)
  req.config = {};
  return next();
};
