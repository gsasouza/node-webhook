const Sentry = require('winston-raven-sentry');
const Winston = require('winston');
const { SENTRY_URL } = require('../../config/environment');

const logger = new Winston.Logger({
  transports: [
    new Sentry({
      dsn: SENTRY_URL,
      level: 'info',
      install: true,
    }),
    // new Winston.transports.Console(),
  ],
  exitOnError: false
});

module.exports = logger;
