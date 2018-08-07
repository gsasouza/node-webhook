const QUEUES_IDLE_TIME = {
  0: 0,
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 8100,
  6: 24300,
  7: 72900,
};

const QUEUES = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7'
};

const FIRST_QUEUE = QUEUES[1];

const RAW_QUEUE = QUEUES[0];

const isReadyForTry = (updatedAt, tryTimes) => {
  if (tryTimes === 0) return true;
  const now = Date.now();
  const idleTime = QUEUES_IDLE_TIME[tryTimes + 1];
  return (now - new Date(updatedAt)) > idleTime * 1000
};

module.exports = {
  QUEUES,
  FIRST_QUEUE,
  RAW_QUEUE,
  isReadyForTry,
};
