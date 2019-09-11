const path = require('path');
const packageJson = require('../../../package.json');

const { getEnvConfig } = require('./utils');
const envConfig = getEnvConfig();

module.exports = {
  APP_NAME: packageJson.name,
  APP_VERSION: packageJson.version,
  APP_ABBREVIATION: packageJson.daisy.abbreviation,

  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  TEMP_FOLDER_PATH: path.join(__dirname, '../../../', envConfig.TEMP_FOLDER_PATH),
  TEMP_FOLDER_CLEANUP: envConfig.TEMP_FOLDER_CLEANUP,

  PORT: envConfig.PORT,
  DEFAULT_LOCALE: envConfig.DEFAULT_LOCALE,

  MONGO_URI: envConfig.MONGO_URI,

  AUTH_SECRET: envConfig.AUTH_SECRET,
  AUTH_SALT_ROUNDS: envConfig.AUTH_SALT_ROUNDS,
  AUTH_ACCESS_TOKEN_EXPIRATION: envConfig.AUTH_ACCESS_TOKEN_EXPIRATION,
  AUTH_REFRESH_TOKEN_EXPIRATION: envConfig.AUTH_REFRESH_TOKEN_EXPIRATION,
  AUTH_EMAIL_TOKEN_EXPIRATION: envConfig.AUTH_EMAIL_TOKEN_EXPIRATION,
  AUTH_REGISTRATION_DISABLED: envConfig.AUTH_REGISTRATION_DISABLED,

  EMAIL_MAILGUN_API_KEY: envConfig.EMAIL_MAILGUN_API_KEY,
  EMAIL_MAILGUN_DOMAIN: envConfig.EMAIL_MAILGUN_DOMAIN,
  EMAIL_FROM_ADDRESS: envConfig.EMAIL_FROM_ADDRESS,
};
