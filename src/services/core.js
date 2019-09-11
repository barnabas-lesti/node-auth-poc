const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const mongoose = require('mongoose');

const { config, logger } = require('../common');

const ROUTES_FOLDER_PATH = path.join(__dirname, '../routes');

class Core {
  async connectToMongoDb () {
    if (config.MONGO_URI) {
      mongoose.set('useFindAndModify', false);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useNewUrlParser', true);
      mongoose.Promise = Promise;

      await mongoose.connect(config.MONGO_URI);
      logger.info('Connected to MongoDB.');
    } else {
      logger.info('MONGO_URI not set, skipping MongoDB connection');
    }
  }

  async createTempFolder () {
    if (config.TEMP_FOLDER_CLEANUP && await fs.pathExists(config.TEMP_FOLDER_PATH)) await fs.remove(config.TEMP_FOLDER_PATH);

    await fs.ensureDir(config.TEMP_FOLDER_PATH);
    logger.info(`TEMP folder ready (cleanup: ${config.TEMP_FOLDER_CLEANUP})`);
  }

  initializeRoutes (app) {
    const modulePaths = glob.sync(path.join(ROUTES_FOLDER_PATH, '**/*.js'));

    for (const modulePath of modulePaths) {
      const routeModule = require(modulePath);
      if (this._isModuleEmpty(routeModule)) continue;

      const normalizedRoutePath = this._normalizeRoutePath(modulePath);
      const finalRoutePath = this._convertRouteParamsInRoutePath(normalizedRoutePath);

      for (const [ method, handler ] of Object.entries(routeModule)) {
        if (!this._isFunction(handler)) continue;

        app.route(finalRoutePath)[method](handler);
      }
    }
    logger.info('Routes initialized');
  }

  _isModuleEmpty (candidate) {
    return Object.keys(candidate).length === 0 && candidate.constructor === Object;
  }

  _isFunction (candidate) {
    return candidate && typeof candidate === 'function';
  }

  _normalizeRoutePath (routePath) {
    return path
      .normalize(routePath)
      .replace(ROUTES_FOLDER_PATH, '')
      .replace(/\.js/g, '')
      .replace(/\/index$/, '')
      .replace(/\\/g, '/');
  }

  _convertRouteParamsInRoutePath (routePath) {
    return routePath
      .split('/')
      .map(fragment => {
        if (!fragment.startsWith('_')) return fragment;

        return fragment
          .replace('_', ':')
          .replace(/([-][a-z])/g, (group) => group
            .toUpperCase()
            .replace('-', '')
          );
      })
      .join('/');
  }
}

module.exports = new Core();
