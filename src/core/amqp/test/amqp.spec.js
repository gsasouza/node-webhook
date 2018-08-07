const testSetup = require('../../../test/setup');
const { consume, publish } = require('../amqp');

const {
  getQueues,
  clearQueues,
} = require('../../../test/mock/amqplib');

beforeAll(() => testSetup());

beforeEach(() => clearQueues());

test('should publish a message to queue', async () => {
  await publish(1, {
    webhook: 'https://localhost.com:5003',
    payload: {
      message: 'test',
    }
  });
  expect(getQueues()).toMatchSnapshot();
});

test('should consume a message from a queue', async () => {
  await publish(1,
    {
      payload: {
        message: 'test',
      },
      webhook: 'https://localhost.com:5003',
      tryTimes: 0,
      updatedAt: Date.now(),
    }
  );
  const message = await consume(1);
  expect(message).toMatchSnapshot();
  expect(getQueues()).toMatchSnapshot();
});

test('should return undefined if does not have messages to consume', async () => {
  const message = await consume(1);
  expect(message).toMatchSnapshot();
});
