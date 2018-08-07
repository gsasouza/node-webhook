const { isReadyForTry } = require('../queues');

test('should know if a queue is ready for the first try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 0, 1, 0));
  expect(isReadyForTry(updatedAt, 0)).toBe(true);
});

test('should know if a queue is ready for the second try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 5, 1, 0));
  expect(isReadyForTry(updatedAt, 1)).toBe(true);
});

test('should know if a queue is not ready for the second try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 4, 1, 0));
  expect(isReadyForTry(updatedAt, 1)).toBe(false);
});

test('should know if a queue is ready for the third try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 15, 1, 0));
  expect(isReadyForTry(updatedAt, 2)).toBe(true);
});

test('should know if a queue is not ready for the third try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 14, 1, 0));
  expect(isReadyForTry(updatedAt, 2)).toBe(false);
});

test('should know if a queue is ready for the fourth try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 45, 1, 0));
  expect(isReadyForTry(updatedAt, 3)).toBe(true);
});

test('should know if a queue is not ready for the fourth try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 1, 44, 1, 0));
  expect(isReadyForTry(updatedAt, 3)).toBe(false);
});

test('should know if a queue is ready for the fifth try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 3, 15, 1, 0));
  expect(isReadyForTry(updatedAt, 4)).toBe(true);
});

test('should know if a queue is not ready for the fifth try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 3, 14, 1, 0));
  expect(isReadyForTry(updatedAt, 4)).toBe(false);
});

test('should know if a queue is ready for the sixth try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 7, 45, 1, 0));
  expect(isReadyForTry(updatedAt, 5)).toBe(true);
});

test('should know if a queue is not ready for the sixth try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 7, 44, 1, 0));
  expect(isReadyForTry(updatedAt, 5)).toBe(false);
});

test('should know if a queue is ready for the seventh try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 21, 15, 1, 0));
  expect(isReadyForTry(updatedAt, 6)).toBe(true);
});

test('should know if a queue is not ready for the seventh try', () => {
  const updatedAt = new Date(2018, 8, 2, 1, 0, 0, 0);
  Date.now = jest.fn(() => new Date(2018, 8, 2, 21, 14, 1, 0));
  expect(isReadyForTry(updatedAt, 6)).toBe(false);
});
