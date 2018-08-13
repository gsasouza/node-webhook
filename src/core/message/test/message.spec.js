const { consumeMessages, createRawMessage, formatAndCreateMessages, sendMessage, manageRejectedMessage } = require('../message');
const { delay } = require('../../helpers');
const { publish, clearQueues, checkQueues } = require('../../amqp');

beforeEach(() => clearQueues());

jest.mock('axios',
  () => jest.fn(({ url }) => {
    if (url === 'successUrl') return {
      status: 200,
      statusText: 'OK',
    };
    return {
      status: 400,
      statusText: 'ERROR',
    }
  })
);

test('Should add a new raw message to queue', async () => {
  await createRawMessage({
    webhooks: ['https://localhost.com:5003', 'https://localhost.com:5004'],
    payload: {
      message: 'test',
    }
  });

  const queuesState = await checkQueues();

  expect(queuesState).toMatchSnapshot();
});

test('Should consume and format a raw message', async () => {
  await createRawMessage({
    webhooks: ['https://localhost.com:5003', 'https://localhost.com:5004'],
    payload: {
      message: 'test',
    }
  });

  consumeMessages(['0']);

  await delay(2000);

  const queuesState = await checkQueues();
  expect(queuesState).toMatchSnapshot();
}, 10000);


test('Should format a raw message', async () => {
  const message = {
    webhooks: ['https://localhost.com:5003', 'https://localhost.com:5004'],
    payload: {
      message: 'test',
    }
  };

  await formatAndCreateMessages(message);

  const queuesState = await checkQueues();
  expect(queuesState).toMatchSnapshot();
});

test('Should consume and send a message', async () => {
  const message = {
    webhook: 'https://localhost.com:5003',
    payload: {
      message: 'test',
    }
  };

  await publish('1', message);

  await delay(2000);

  consumeMessages(['1']);

  const queuesState = await checkQueues();
  expect(queuesState).toMatchSnapshot();
});


test('Should consume and send a message', async () => {
  const message = {
    webhook: 'https://localhost.com:5003',
    payload: {
      message: 'test',
    }
  };

  await publish('1', message);

  await delay(2000);

  consumeMessages(['1']);

  const queuesState = await checkQueues();
  expect(queuesState).toMatchSnapshot();
});


test('Should send a message', async () => {
  const message = {
    webhook: 'successUrl',
    payload: {
      message: 'test',
    }
  };

  const success = await sendMessage(message);
  expect(success).toBe(true);
});

test('Should get an error on sending message and manage reject', async () => {
  const message = {
    webhook: 'errorUrl',
    payload: {
      message: 'test',
    },
    tryTimes: 0,
  };

  const success = await sendMessage(message);
  const queuesState = await checkQueues();

  expect(queuesState).toMatchSnapshot();
  expect(!!success).toBe(false);
});

test('Should manage a message reject', async () => {
  const message = {
    webhook: 'errorUrl',
    payload: {
      message: 'test',
    },
    tryTimes: 0,
  };

  await manageRejectedMessage(message);
  const queuesState = await checkQueues();

  expect(queuesState).toMatchSnapshot();
});
