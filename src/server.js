const fs = require('fs-extra');
const express = require('express');
const bodyParser = require('body-parser');

const {
  NODE_ENV,
  PORT,
  BASE_URL,
  NO_CLIENT,
  TEMP_DIR_PATH,
  CLEAN_UP_TEMP_FOLDER,
} = require('./config');
const { Logger, Database } = require('./utils');

(async () => {
  const app = express();
  const nuxt = new Nuxt(require('../../config/nuxt'));

  app.use([
    require('./middlewares/http-access')(),
  ]);

  app.use('/api', [
    bodyParser.json(),
    require('./middlewares/config')(),
    require('./middlewares/response-delay')(),
    require('./middlewares/auth')(),
    ...require('./api').map(routeFactory => routeFactory(express.Router())),
  ]);

  Logger.info(`Using configuration: "${NODE_ENV}"`);

  if (NO_CLIENT) {
    Logger.info('NO_CLIENT is enabled, skipping client setup');
  } else {
    Logger.info('Building client...');
    if (NODE_ENV !== 'production') {
      const builder = new Builder(nuxt);
      await builder.build();
    } else {
      await nuxt.ready();
    }
    app.use(nuxt.render);
    Logger.success('Client ready');
  }

  await createTempDir();
  Database.connect();

  const server = await app.listen(PORT);
  const { address } = server.address();
  Logger.success(`Server running at http://${address}:${PORT} (BASE_URL: ${BASE_URL})`);
})();

async function createTempDir () {
  if (CLEAN_UP_TEMP_FOLDER && await fs.pathExists(TEMP_DIR_PATH)) await fs.remove(TEMP_DIR_PATH);

  await fs.ensureDir(TEMP_DIR_PATH);
  Logger.success(`TEMP directory ready (cleanup: ${CLEAN_UP_TEMP_FOLDER})`);
}
