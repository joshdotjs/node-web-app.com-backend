const express = require('express');
const router = express.Router();
const db = require('../../db/db-config');

const authMiddleware = require('../auth/middleware');
const usersModel = require('./model');

// ==============================================

router.get('/', 
  authMiddleware.restricted,
  authMiddleware.admin,
  async (req, res) => {

  console.log('[GET] /api/users ');

  async function getAllUsers() { return db('users') };

  const users = await getAllUsers();

  res.status(201).json({ users })
});

// ==============================================

router.post('/', async (req, res) => {

  console.log('[POST] /api/users ');

  async function insertUser(user) {
    // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
    // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
    const [newUserObject] = await db('users').insert(user, ['user_id', 'username', 'password'])
    return newUserObject // { user_id: 7, username: 'foo', password: 'xxxxxxx' }
  }

  res.status(201).json(await insertUser(req.body))
});

// ==============================================

router.get('/:id', 
  authMiddleware.restricted,
  // authMiddleware.admin,
  async (req, res) => {

    const id = req.params.id;

    console.log('[GET] /api/users/:id -- user_id: ', id);

    // -A logged in user can get info on themselves, but no other user.
    //  => Ensure that user_id is the same ID as the user sending the request.
    //  => compare user_id to the user-id encoded in the JWT.
    // console.log('res.locals.decoded_token: ', res.locals.decoded_token);

    if ( id == res.locals.decoded_token.id ) {
      try {
        const user = await usersModel.getUserById(id);
        if (user.length > 0) {
          res.status(200).json({ user: user[0] });
        } else {
          // next(new HttpError('user does not exist in database', 400));
          res.status(401).json({ message: 'ERROR 400: user does not exist in database'});
        }
      } catch (err) {
        // next(new HttpError('error looking up user by user_id', 400));
        res.status(400).json({ message: 'ERROR 400: Bad request'});
      }
    } else {
      res.status(401).json({ message: 'ERROR 401: Unauthorized. Users can only access their own account. You are trying to access a user account different than your own.'});
    }

});

// ==============================================

// [GET] /api/users/:user_id
const getUserById = async (req, res, next) => {
};

// ==============================================

module.exports = router;