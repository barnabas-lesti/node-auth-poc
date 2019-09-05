const { NODE_ENV } = require('../../../config/env');
const { Logger } = require('../utils');

const routes = [
  require('./ingredients'),
  require('./recipes'),
  require('./auth'),
];

if (NODE_ENV === 'test') {
  routes.push(...[
    require('./test'),
  ]);
  Logger.info('TEST routes initialized: /api/test');
}

module.exports = routes;
