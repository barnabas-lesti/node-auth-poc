const winston = require('winston');

const config = require('./config');

const transports = [
  new winston.transports.Console(),
];

const { combine, colorize, label, timestamp, printf } = winston.format;
const format = combine(
  colorize(),
  label({ label: config.APP_ABBREVIATION }),
  timestamp(),
  printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`),
);

module.exports = winston.createLogger({
  level: config.IS_TEST ? 'error': 'info',
  exitOnError: false,
  format,
  transports,
});
