const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const { hash } = require('../../util/hash');

const jwt = require('jsonwebtoken');

const UsersModel = require('../users/model');

// ==============================================

const register = async (req, res, next) => {
  // Get todays date and time-index:

  let user = { ...req.body };
  console.log('[POST] /api/auth/register, user: ', user);

  // never save the plain text password in the db
  user.password = hash(user.password);

  try {
    const new_user = await UsersModel.insertUser(user);
    console.log('new_user: ', new_user);

    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    // next(new HttpError('Error', 400));
    res.status(400).json({ message: 'ERROR 400: Bad request'});
  }
};

// ==============================================

const login = async (req, res, next) => {

  const { email, password } = req.body;

  console.log('[POST] /api/auth/login');
  console.log('email: ', email, '\tpassword: ', password);

  try {
    const user_array = await UsersModel.getUserByEmail(email);

    const user = user_array[0];
    console.log('user: ', user);

    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      };

      const options = {
        expiresIn: '1d', // '1d, 1h, 1m
      };

      const token_secret = process.env.TOKEN_SECRET;

      const token = jwt.sign(payload, token_secret, options);


      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login
      // TODO: Handle unsuccessful login

      res.status(200).json({
        status: 'success',
        user,
        token,
      });
    } else {
      //next(new HttpError('Invalid Credentials', 401));
      res.status(401).json({ message: 'ERROR 401: Unauthorized'});
    }
  } catch (err) {
    res.status(400).json({ message: 'ERROR 400: Bad request'});
  }
};

// ==============================================

module.exports = {
  register,
  login
};
