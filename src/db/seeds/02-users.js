const { hash } = require('../../util/hash');

// ==============================================

exports.seed = function (knex) {
  
  // --------------------------------------------
  
  const users = [
    {
      email: 'josh@josh.com',
      password: hash('josh'),
      is_admin: true,
    },
    {
      email: 'steve@steve.com',
      password: hash('steve'),
      is_admin: false,
    }
  ];

  // --------------------------------------------

  return knex('users').insert(users);

  // --------------------------------------------
};

// ==============================================