const { createLogger, format, transports } = require('winston');
const { combine, printf } = format;

const logFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

// instantiate a new Winston Logger
module.exports = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: combine(format.colorize(), logFormat)
    })
  ],
  exitOnError: false
});


