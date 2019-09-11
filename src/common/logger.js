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

const logger = winston.createLogger({
  exitOnError: false,
  format,
  transports,
});

module.exports = logger;
