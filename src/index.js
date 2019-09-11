const express = require('express');
const bodyParser = require('body-parser');

const { config, logger } = require('./common');
const { core, router, timer } = require('./services');

(async () => {
  const timerInstance = timer.createTimer();
  const app = express();

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
