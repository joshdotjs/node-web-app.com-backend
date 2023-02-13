const bcrypt = require('bcryptjs');

// ==============================================

const hash = (password) => {
  const rounds = process.env.BCRYPT_ROUNDS || 8; // 2^8
  return bcrypt.hashSync(password, rounds);
};

// ==============================================

module.exports = {
  hash
};