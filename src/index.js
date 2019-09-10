const express = require('express');
const bodyParser = require('body-parser');

const { config, logger } = require('./common');
const { core } = require('./services');

(async () => {
  const app = express();

  logger.info(`Using configuration: "${config.NODE_ENV}".`);

  app.use('*', [
    bodyParser.json(),
    require('./middlewares/config')(),
    require('./middlewares/auth')(),
  ]);

  core.initializeRoutes(app);

  await core.createTempFolder();
  await core.connectToMongoDb();

  const server = await app.listen(config.PORT);
  const { address } = server.address();
  logger.success(`Server running at http://${address}:${config.PORT}.`);
})();
