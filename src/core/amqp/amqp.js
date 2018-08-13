const amqp = require('amqplib');
const { RABBIT_MQ_URL } = require('../../config/environment');
const { isReadyForTry, QUEUES } = require('./queues');
const { delay } = require('../helpers');
const logger = require('../logger');

const connect = async () => amqp.connect(RABBIT_MQ_URL);

const createChannel = async (connection) => connection.createChannel();

const publish = async (queue, payload) => {
  try {
    const connection = await connect();
    const channel = await createChannel(connection);
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true, messageId: payload.messageId });
    await delay(500);
    connection.close();
  } catch (error) {
    logger.error('Error on Message Publish', { extra: error });
  }
};

const consume = async (queue, action) => {
  try {
    const connection = await connect();
    const channel = await createChannel(connection);
    await channel.assertQueue(queue);
    return channel.consume(queue, (message) => {
      const parsedMessage = JSON.parse(message.content.toString() || '');
      const { updatedAt, tryTimes } = parsedMessage;
      if (isReadyForTry(updatedAt, tryTimes)) {
        channel.ack(message);
        return action(parsedMessage);
      }
      return channel.reject(message, true);
    });
  } catch (error) {
    logger.error('Error on Message Consume', { extra: error });
  }
};

const checkQueue = async (queue) => {
  const connection = await connect();
  const channel = await createChannel(connection);
  const checkedQueue = await channel.checkQueue(queue);
  const { messageCount } = checkedQueue;
  connection.close();
  return { messageCount, queue };
};

const clearQueue = async (queue) => {
  const connection = await connect();
  const channel = await createChannel(connection);
  await channel.purgeQueue(queue);
  connection.close();
};

const clearQueues = async () => Promise.all(Object.values(QUEUES).map(queue => clearQueue(queue)));

const checkQueues = async () => Promise.all(Object.values(QUEUES).map(queue => checkQueue(queue)));


module.exports = {
  publish,
  consume,
  checkQueue,
  checkQueues,
  clearQueues
};
