
module.exports = () => {
  Date.now = jest.fn(() => 1);
};
