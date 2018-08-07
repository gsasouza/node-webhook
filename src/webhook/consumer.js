const { args = [] } = require('../config');
const { QUEUES } = require('../core/amqp');
const { consumeMessages } = require('../core/message');

const getQueuesToConsume = () => {
  if (args.includes('all')) return Object.values(QUEUES);
  return args.map(arg => QUEUES[arg]);
};

const queuesToConsume = getQueuesToConsume();

consumeMessages(queuesToConsume);

console.log(`Consuming queues ${queuesToConsume.join(', ')}`);
