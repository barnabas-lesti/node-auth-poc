const path = require('path');
const packageJson = require('../../package.json');
const requireYml = require('require-yml');

const ENV_FOLDER_PATH = '../../env';
const POPULATION_REGEX = /<(.*?)>/g;
const TOKEN_TO_KEY_REGEX = /<|>/g;

const envConfig = getEnvConfig();

const config = {
  APP_NAME: packageJson.name,
  APP_VERSION: packageJson.version,
  APP_ABBREVIATION: packageJson.daisy.abbreviation,

  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  TEMP_FOLDER_PATH: path.join(__dirname, '../../../temp'),

  PORT: envConfig.PORT,
  DEFAULT_LOCALE: envConfig.DEFAULT_LOCALE,
  CLEAN_TEMP_FOLDER: envConfig.CLEAN_TEMP_FOLDER,
  LOG_TO_FILE: envConfig.LOG_TO_FILE,

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

function getEnvConfig () {
  const rawEnvConfigFromConfigFiles = getRawEnvConfigFromConfigFiles();
  const rawEnvConfig = {
    ...rawEnvConfigFromConfigFiles,
    ...getRawEnvConfigFromProcessEnv(rawEnvConfigFromConfigFiles),
  };
  return populateConfig(rawEnvConfig);
}

function getRawEnvConfigFromConfigFiles () {
  const rawConfigPack = requireYml(path.join(__dirname, ENV_FOLDER_PATH));
  return {
    ...(rawConfigPack.default || {}),
    ...(rawConfigPack[process.env.NODE_ENV] || {}),
    ...(rawConfigPack.local || {}),
  };
}

function getRawEnvConfigFromProcessEnv (rawEnvConfig) {
  const configFromProcessEnv = {};
  for (const existingConfigKey of Object.keys(rawEnvConfig)) {
    const processEnvValue = process.env[existingConfigKey];
    if (processEnvValue !== undefined) configFromProcessEnv[existingConfigKey] = parseToPrimitive(processEnvValue);
  }
  return configFromProcessEnv;
}

function parseToPrimitive (value) {
  const number = Number(value);
  if (number) return number;
  if (value === 'true' || value === 'false') return value === 'true';
  return value;
}

function populateConfig (rawEnvConfig) {
  const parsedConfig = {};
  for (const key of Object.keys(rawEnvConfig)) {
    const configString = rawEnvConfig[key];
    parsedConfig[key] = populateConfigString(configString, rawEnvConfig);
  }
  return parsedConfig;
}

function populateConfigString (configString, rawEnvConfig) {
  if (
    !configString ||
    typeof configString !== 'string' ||
    !configString.match(POPULATION_REGEX)
  ) return configString;

  let populatedConfigString = configString;
  const match = configString.match(POPULATION_REGEX);
  for (const matchString of match) {
    const replacementKey = matchString.replace(TOKEN_TO_KEY_REGEX, '');
    let replacementValue = rawEnvConfig[replacementKey];
    if (
      replacementValue &&
      typeof replacementValue === 'string' &&
      replacementValue.match(POPULATION_REGEX)
    ) replacementValue = populateConfigString(replacementValue, rawEnvConfig);

    populatedConfigString = populatedConfigString.replace(matchString, replacementValue);
  }

  return populatedConfigString;
}

module.exports = config;
