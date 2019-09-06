const path = require('path');
const packageJson = require('../../../package.json');

process.env.NODE_CONFIG_DIR = path.join(__dirname, '../../../env');
const configResolver = require('config');

const { parseConfig } = require('./utils');

const rawConfig = {
  PORT: process.env.PORT || configResolver.get('PORT'),

  MONGO_USERNAME: process.env.MONGO_USERNAME || configResolver.get('MONGO_USERNAME'),
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || configResolver.get('MONGO_PASSWORD'),
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || configResolver.get('MONGO_DB_NAME'),
  MONGO_URI: process.env.MONGO_URI || configResolver.get('MONGO_URI'),

  AUTH_SECRET: process.env.AUTH_SECRET || configResolver.get('AUTH_SECRET'),
  AUTH_SALT_ROUNDS: process.env.AUTH_SALT_ROUNDS || configResolver.get('AUTH_SALT_ROUNDS'),
  AUTH_ACCESS_TOKEN_EXPIRATION: process.env.AUTH_ACCESS_TOKEN_EXPIRATION || configResolver.get('AUTH_ACCESS_TOKEN_EXPIRATION'),
  AUTH_REFRESH_TOKEN_EXPIRATION: process.env.AUTH_REFRESH_TOKEN_EXPIRATION || configResolver.get('AUTH_REFRESH_TOKEN_EXPIRATION'),
  AUTH_EMAIL_TOKEN_EXPIRATION: process.env.AUTH_EMAIL_TOKEN_EXPIRATION || configResolver.get('AUTH_EMAIL_TOKEN_EXPIRATION'),
  AUTH_REGISTRATION_DISABLED: process.env.AUTH_REGISTRATION_DISABLED || configResolver.get('AUTH_REGISTRATION_DISABLED'),
};

const finalConfig = {
  ...parseConfig(rawConfig),

  APP_NAME: packageJson.name,
  APP_VERSION: packageJson.version,
  APP_ABBREVIATION: packageJson.daisy.abbreviation,

  NODE_ENV: process.env.NODE_ENV,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

console.log(finalConfig);

module.exports = finalConfig;
