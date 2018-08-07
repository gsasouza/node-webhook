const logger = require('../logger');

const loggerMiddleware = () => logger.transports.sentry.raven.requestHandler(true);

module.exports = loggerMiddleware;
