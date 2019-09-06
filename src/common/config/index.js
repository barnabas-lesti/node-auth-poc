const packageJson = require('../../../package.json');

const { getEnvConfig } = require('./utils');
const envConfig = getEnvConfig();

module.exports = {
  APP_NAME: packageJson.name,
  APP_VERSION: packageJson.version,
  APP_ABBREVIATION: packageJson.daisy.abbreviation,

  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  PORT: envConfig.PORT,

  MONGO_URI: envConfig.MONGO_URI,

  AUTH_SECRET: envConfig.AUTH_SECRET,
  AUTH_SALT_ROUNDS: envConfig.AUTH_SALT_ROUNDS,
  AUTH_ACCESS_TOKEN_EXPIRATION: envConfig.AUTH_ACCESS_TOKEN_EXPIRATION,
  AUTH_REFRESH_TOKEN_EXPIRATION: envConfig.AUTH_REFRESH_TOKEN_EXPIRATION,
  AUTH_EMAIL_TOKEN_EXPIRATION: envConfig.AUTH_EMAIL_TOKEN_EXPIRATION,
  AUTH_REGISTRATION_DISABLED: envConfig.AUTH_REGISTRATION_DISABLED,
};
