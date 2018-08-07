const {
  getQueues,
  clearQueues,
} = require('../../../test/mock');

const testSetup = require('../../../test/setup');

const {
  addNewMessageToQueue,
  consumeMessages,
  consumeRetryMessages,
} = require('../message');

const { publish } = require('../../amqp');

beforeAll(() => testSetup());

beforeEach(() => clearQueues());

test('Should add a new message to queue', async () => {
  await addNewMessageToQueue({
    webhook: 'https://localhost.com:5003',
    payload: {
      message: 'test',
    }
  });
  expect(getQueues()).toMatchSnapshot();
});

test('Should consume and delivery a first try message', async () => {
  await addNewMessageToQueue({
    webhook: 'successUrl',
    payload: {
      message: 'test',
    }
  });
  await consumeMessages();
  expect(getQueues()).toMatchSnapshot();
});

test('Should consume and get an error on delivery with a first try message', async () => {
  await addNewMessageToQueue({
    webhook: 'errorUrl',
    payload: {
      message: 'test',
    }
  });
  await consumeMessages();
  expect(getQueues()).toMatchSnapshot();
});

test('Should get a retry message that is in idle time', async () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 14, 1, 0));
  await publish(3,
    {
      payload: {
        message: 'test',
      },
      webhook: 'https://localhost.com:5003',
      tryTimes: 0,
      updatedAt,
    }
  );
  await consumeRetryMessages();
  expect(getQueues()).toMatchSnapshot();
});

test('Should consume and delivery with a retry message', async () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 15, 1, 0));
  await publish(3,
    {
      payload: {
        message: 'test',
      },
      webhook: 'successUrl',
      tryTimes: 2,
      updatedAt,
    }
  );
  await consumeRetryMessages();
  expect(getQueues()).toMatchSnapshot();
});

test('Should consume and get an error on delivery with a retry message', async () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 15, 1, 0));
  await publish(3,
    {
      payload: {
        message: 'test',
      },
      webhook: 'errorUrl',
      tryTimes: 2,
      updatedAt,
    }
  );
  await consumeRetryMessages();
  expect(getQueues()).toMatchSnapshot();
});
