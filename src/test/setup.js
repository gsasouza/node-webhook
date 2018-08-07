const {
  mockedConnect
} = require('./mock');

const queues = require('../core/amqp/queues');


module.exports = () => {
  Date.now = jest.fn(() => 1);
};
