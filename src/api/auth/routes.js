const express = require('express');
const router = express.Router();

// ==============================================

// import authController from './controller';
const authController = require('./controller');

// ==============================================

// [POST] /api/auth/register
router.post(
  '/register',
  // authMiddleware.checkAuthPayload,
  authController.register
);

// ==============================================

// [POST] /api/auth/login
router.post(
  '/login',
  //authMiddleware.checkAuthPayload,
  authController.login
);

// ==============================================

module.exports = router;