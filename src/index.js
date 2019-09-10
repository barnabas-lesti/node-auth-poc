const express = require('express');
const bodyParser = require('body-parser');

const { config, logger } = require('./common');
const { createTempFolder, connectToMongoDb } = require('./startup');
const { initializeRoutes } = require('./routes');

(async () => {
  const app = express();

  logger.info(`Using configuration: "${config.NODE_ENV}"`);

  app.use('*', [
    bodyParser.json(),
    require('./startup/middlewares/config')(),
    require('./startup/middlewares/auth')(),
  ]);

  initializeRoutes(app);

  // await createTempFolder();
  // await connectToMongoDb();

  const server = await app.listen(config.PORT);
  const { address } = server.address();
  logger.success(`Server running at http://${address}:${config.PORT}`);
})();
