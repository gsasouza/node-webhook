require('dotenv').config();
const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL || 'amqp://localhost';
const PRIVATE_HASH_KEY = process.env.PRIVATE_HASH_KEY || 's3cr3t';
const SENTRY_URL = process.env.SENTRY_URL;
const PRODUCER_PORT = process.env.PRODUCER_PORT;
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
module.exports = {
  RABBIT_MQ_URL,
  PRIVATE_HASH_KEY,
  SENTRY_URL,
  PRODUCER_PORT,
  PORT,
  MONGO_URL
};
