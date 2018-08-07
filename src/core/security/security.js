const crypto = require('crypto');
const { PRIVATE_HASH_KEY } = require('../../config/environment');

const signWithHmac = (publicKey) => crypto.createHmac('sha256', PRIVATE_HASH_KEY).update(publicKey).digest('hex');

module.exports = {
  signWithHmac,
};
