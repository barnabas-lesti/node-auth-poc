const express = require('express');
const bodyParser = require('body-parser');

const config = require('./common/config');
const logger = require('./common/logger');
const core = require('./services/core');
const router = require('./services/router');
const timer = require('./services/timer');

const app = express();

(async () => {
  const timerInstance = timer.createTimer();
  logger.info(`Using configuration: "${config.NODE_ENV}"`);

  app.use('*', [
    bodyParser.json(),
    require('./middlewares/config')(),
    require('./middlewares/auth')(),
  ]);

  router.initializeRoutes(app);

  await core.createTempFolder();
  await core.connectToMongoDb();

  const server = await app.listen(config.PORT);
  const { address } = server.address();
  logger.info(`Server running at http://${address}:${config.PORT} (${timerInstance.finish()}ms)`);
})();

module.exports = app;
