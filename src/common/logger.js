const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');
const { combine, colorize, label, timestamp, printf } = winston.format;

const config = require('./config');

const LOGS_FOLDER_PATH = path.join(config.APP_ROOT_PATH, './logs');

if (config.CLEAN_LOGS_FOLDER) cleanLogsFolder();

const baseFormatConfig = [
  label({ label: config.APP_ABBREVIATION }),
  timestamp(),
  printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`)
];

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      ...baseFormatConfig,
    ),
  }),

  ...(config.LOG_TO_FILE ? [ new winston.transports.File({
    level: 'info',
    filename: generateLogFilePath(),
  }) ] : []),
];

const logger = winston.createLogger({
  level: config.IS_TEST ? 'error': 'info',
  format: combine(...baseFormatConfig),
  exitOnError: false,
  transports,
});

function generateLogFilePath () {
  const fileName = `${Date.now()}.log`;
  return path.join(__dirname, '../../logs', fileName);
}

function cleanLogsFolder () {
  if (fs.pathExistsSync(LOGS_FOLDER_PATH)) fs.removeSync(LOGS_FOLDER_PATH);
}

module.exports = logger;
