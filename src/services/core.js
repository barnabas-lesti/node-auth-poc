const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const mongoose = require('mongoose');

const { config, logger } = require('../common');

class Core {
  async connectToMongoDb () {
    if (config.MONGO_URI) {
      mongoose.set('useFindAndModify', false);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useNewUrlParser', true);
      mongoose.Promise = Promise;

      await mongoose.connect(config.MONGO_URI);
      logger.success('Connected to MongoDB.');
    } else {
      logger.info('MONGO_URI not set, skipping MongoDB connection.');
    }
  }

  async createTempFolder () {
    if (config.TEMP_FOLDER_CLEANUP && await fs.pathExists(config.TEMP_FOLDER_PATH)) await fs.remove(config.TEMP_FOLDER_PATH);

    await fs.ensureDir(config.TEMP_FOLDER_PATH);
    logger.success(`TEMP folder ready (cleanup: ${config.TEMP_FOLDER_CLEANUP}).`);
  }

  initializeRoutes (app) {
    const routesFolderPath = path.join(__dirname, '../routes');
    const modulePaths = glob.sync(path.join(routesFolderPath, '**/*.js'));

    for (const modulePath of modulePaths) {
      const routeModule = require(modulePath);
      if (this._isModuleEmpty(routeModule)) continue;

      const urlPath = path
        .normalize(modulePath)
        .replace(routesFolderPath, '')
        .replace(/\.js/g, '')
        .replace(/\/index$/, '')
        .replace(/\\/g, '/');

      for (const [ method, handler ] of Object.entries(routeModule)) {
        if (!this._isFunction(handler)) continue;

        app.route(urlPath)[method](handler);
      }
    }
    logger.success('Routes initialized.');
  }

  _isModuleEmpty (candidate) {
    return Object.keys(candidate).length === 0 && candidate.constructor === Object;
  }

  _isFunction (candidate) {
    return candidate && typeof candidate === 'function';
  }
}

module.exports = new Core();
