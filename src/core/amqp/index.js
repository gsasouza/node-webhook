const amqp = require('./amqp');
const queues = require('./queues');

module.exports = {
  ...amqp,
  ...queues,
};
