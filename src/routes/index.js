const path = require('path');
const glob = require('glob');

const { logger } = require('../common');

const isModuleEmpty = (routeModule) => Object.keys(routeModule).length === 0 && routeModule.constructor === Object;
const isValidRouteHandler = (handler) => handler && typeof handler === 'function';

const initializeRoutes = (app) => {
  const modulePaths = glob.sync(path.join(__dirname, '**/*.js'));

  for (const modulePath of modulePaths) {
    const routeModule = require(modulePath);
    if (isModuleEmpty(routeModule)) continue;

    const urlPath = path
      .normalize(modulePath)
      .replace(__dirname, '')
      .replace(/\.js/g, '')
      .replace(/\\/g, '/');

    for (const [ method, handler ] of Object.entries(routeModule)) {
      if (!isValidRouteHandler(handler)) continue;

      console.log(method);

      app.route(urlPath)[method](handler);
    }
  }

  logger.success('Routes initialized.');
};

module.exports = {
  initializeRoutes,
};
