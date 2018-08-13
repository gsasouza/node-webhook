const { consume, publish, clearQueues, checkQueue } = require('../amqp');

beforeEach(() => clearQueues());

Date.now = jest.fn(() => 1);

test('should publish a message to queue', async () => {
  const QUEUE = '1';
  await publish(QUEUE, {
    webhook: 'https://localhost.com:5003',
    payload: {
      message: 'test',
    }
  });
  const queueState = await checkQueue(QUEUE);
  expect(queueState).toMatchSnapshot();
});

test('should consume a message from a queue', async () => {
  const QUEUE = '1';
  await publish(QUEUE,
    {
      payload: {
        message: 'test',
      },
      webhook: 'https://localhost.com:5003',
      tryTimes: 0,
      updatedAt: Date.now(),
    }
  );
  let message = '';
  await consume(QUEUE, (resultMessage) => message = resultMessage);
  const queueState = await checkQueue(QUEUE);
  expect(message).toMatchSnapshot();
  expect(queueState).toMatchSnapshot();
});
