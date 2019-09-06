const express = require('express');
const bodyParser = require('body-parser');

const { config, logger } = require('./common');
const { createTempFolder, connectToMongoDb } = require('./startup');

(async () => {
  const app = express();

  logger.info(`Using configuration: "${config.NODE_ENV}"`);

  app.use('/api', [
    bodyParser.json(),
    require('./startup/middlewares/config')(),
    require('./startup/middlewares/auth')(),
  ]);

  // TODO: Init. routes

  await createTempFolder();
  connectToMongoDb();

  const server = await app.listen(config.PORT);
  const { address } = server.address();
  logger.success(`Server running at http://${address}:${logger.PORT}`);
})();
