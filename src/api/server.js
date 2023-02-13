require("dotenv").config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// ==============================================

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

// ==============================================

const usersRouter = require('./users/routes');
server.use('/api/users', usersRouter);

const productsRouter = require('./products/routes');
server.use('/api/products', productsRouter);

const checkoutRouter = require('./checkout/routes');
server.use('/api/checkout', checkoutRouter);

const authRouter = require('./auth/routes');
server.use('/api/auth', authRouter);

const ordersRouter = require('./orders/routes');
server.use('/api/orders', ordersRouter);

// ==============================================

// Catch-All Endpoint
server.use('*', (req, res) => {
  res.status(404).json({
    message: 'eCommerce-node: Route not found 😃',
  });
});

// ==============================================

// error-handling middleware
server.use((err, req, res, next) => {
  console.log('err (in error-handling middleware [server.js]): ', err);
  res.status(err.status || 500).json({ message: err.message });
});

// ==============================================

module.exports = server;

// ==============================================