const path = require('path');
const glob = require('glob');

const config = require('../common/config');
const logger = require('../common/logger');

const ROUTES_FOLDER_PATH = path.join(config.APP_ROOT_PATH, './src/routes');

class Router {
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

module.exports = new Router();
