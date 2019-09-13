const path = require('path');
const winston = require('winston');

const config = require('./config');

const { combine, colorize, label, timestamp, printf } = winston.format;
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
];

if (config.LOG_TO_FILE) {
  transports.push(new winston.transports.File({
    level: 'info',
    filename: generateLogFilePath(),
  }));
}

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

module.exports = logger;
