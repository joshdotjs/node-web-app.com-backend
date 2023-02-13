const db = require('../../db/db-config');

// ==============================================

function getAllUsers() {
  return db('users');
}

// ==============================================

function getUserByEmail(email) {
  // -returns an array with 0th element containing user object:
  // [
  //   {
  //     user_id: 1,
  //     is_admin: ???,
  //     email: 'josh@josh.com',
  //     password: '$2a$08$ooXR4yG7Fp5oYcKgzw2jU.MkYwpQTI5jrDrcrqB6vpBKaX5aZKP0S',
  //     created_at: 2022-01-29T22:46:29.671Z,
  //     updated_at: 2022-01-29T22:46:29.671Z
  //   }
  // ]
  return db('users').where('email', email);
}

// ==============================================

function getUserById(id) {
  return db('users').where('id', id);
}

// ==============================================

async function insertUser(user) {
  // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
  // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
  // UNLIKE SQLITE WHICH FORCES US DO DO A 2ND DB CALL
  const [newUserObject] = await db('users').insert(user, [
    'id',
    'email',
    'password',
    'is_admin',
  ]);
  return newUserObject; // { id: 7, email: 'foo', password: 'xxxxxxx', admin: false }
}

// ==============================================

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  insertUser,
};
