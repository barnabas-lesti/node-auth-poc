const consola = require('consola');

const config = require('./config');

// TODO: implement custom logger
consola.withScope(config.APP_ABBREVIATION);
const logger = consola;

module.exports = logger;
