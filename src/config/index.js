const environment = require('./environment');
const args = require('./args');

module.exports = {
  ...environment,
  args,
};
