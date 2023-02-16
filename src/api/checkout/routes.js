const express = require('express');
const router = express.Router();
// const db = require('../../db/db-config');
const bodyParser = require('body-parser');

// ==============================================

router.get( '/php', require('./controller/checkout-php-test'));
// router.post('/php', require('./controller/checkout-php-test-post'));

// ==============================================

// [POST] /api/checkout/php
router.post('/php', require('./controller/checkout-php'));

// ==============================================

// Use body-parser to retrieve the raw body as a buffer
router.post('/webhook', 
  bodyParser.raw({type: 'application/json'}),
  require('./controller/checkout-webhook')
);

// ==============================================

module.exports = router;