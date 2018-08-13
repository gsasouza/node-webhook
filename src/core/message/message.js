const axios = require('axios');
const uuid = require('uuid/v1');

const { RAW_QUEUE, FIRST_QUEUE, QUEUES, publish, consume } = require('../amqp');
const { signWithHmac } = require('../security');
const logger = require('../logger');

const sendMessage = async (content) => {
  if (!content) return;
  const { payload, webhook } = content;
  try {
    const signature = signWithHmac(JSON.stringify(payload));
    const response = await axios({
      method: 'POST',
      url: webhook,
      data: payload,
      headers: {
        'Signature': signature,
        'Content-Type': 'application/json'
      },
    });

    if (![200, 201, 202, 204].includes(response.status)) {
      logger.error('Error on Message Delivery', { extra: { content, error: response.status }});
      return manageRejectedMessage(content);
    }
    logger.info('Message Delivery', { extra: content });
    return true;
  } catch (error) {
    logger.error('Error on Message Delivery', { extra: { content, error }});
    return manageRejectedMessage(content);
  }
};

const manageRejectedMessage = async (payload) => {
  const newPayload = {
    ...payload,
    tryTimes: payload.tryTimes + 1,
    updatedAt: Date.now(),
  };
  return publish(QUEUES[newPayload.tryTimes + 1], newPayload);
};

const formatAndCreateMessages = async (message) => {
  const { webhooks, payload } = message;
  const messages = webhooks.map(webhook => ({ payload, webhook, tryTimes: 0, messageId: uuid(), updatedAt: Date.now() }));
  return Promise.all(messages.map(async (message) => {
    await publish(FIRST_QUEUE, message);
    logger.info('Created new message', { extra: message });
  }));
};

const getQueueAction = (queue) => {
  switch (queue) {
    case '0':  return formatAndCreateMessages;
    case '1': case '2': case '3': case '4': case '5': case '6': case '7': return sendMessage;
  }
};

const consumeMessages = (queues) => queues.map(queue => consume(queue, getQueueAction(queue)));

const createRawMessage = async (rawMessage) => {
  return publish(RAW_QUEUE, { ...rawMessage, tryTimes: 0, updatedAt: Date.now() });
};

module.exports = {
  createRawMessage,
  consumeMessages,
  formatAndCreateMessages,
  sendMessage,
  manageRejectedMessage,
};
