const queues = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
};

jest.mock('amqplib', () => ({
  connect: mockedConnect,
}));

jest.mock('uuid/v1', () => jest.fn(() => 1));

jest.mock('axios',
  () => jest.fn(({ url }) => {
    if (url === 'successUrl') return {
      status: 200,
      statusText: 'OK',
    };
    if (url === 'errorUrl') return {
      status: 400,
      statusText: 'ERROR',
    };
    else throw Error();
  })
);


const sendToQueue = jest.fn((queue, message) => queues[queue].push(message.toString()));

const get = jest.fn((queue) => {
  if (!queues[queue][0]) return undefined;
  return {
    content: Buffer.from(queues[queue][0])
  };
});

const ack = jest.fn((message) => {
  Object.values(queues).forEach((queue, index) => {
    if(queue[0] === message.content.toString()) {
      queue.shift();
      queues[index + 1] = queue;
    }
  });
});

const mockedConnect = jest.fn(() => ({
  createChannel: () => ({
    assertQueue: () => true,
    sendToQueue,
    get,
    ack,
  }),
  close: () => true,
}));

const getQueues = () => queues;

const clearQueues = () => Object.values(queues).map(queue => queue.length = 0);

module.exports = {
  getQueues,
  clearQueues,
};
