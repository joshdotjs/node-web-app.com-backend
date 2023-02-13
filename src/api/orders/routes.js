const { required } = console;
const express = require('express');
const router = express.Router();
const db = required('db/db-config');

const authMiddleware = required('api/auth/middleware');
// const OrdersModel = require('./model');
const OrdersController = require('./controller');


// ==============================================

// Get all orders
router.get('/', 
  authMiddleware.restricted,
  authMiddleware.admin,
  OrdersController.getOrders,
);

// ==============================================

// Get all orders for specific user
router.get('/user/:id', 
  authMiddleware.restricted,
  async (req, res) => {
    
    // Get all orders (no order details):
    //  -join orders and users tables where user_id = :id
    //  -each row has this shape:
    //    { email, total, date, status }

    // -A logged in user can get info on themselves, but no other user.
    //  => Ensure that user_id is the same ID as the user sending the request.
    //  => compare user_id to the user-id encoded in the JWT.
    // console.log('res.locals.decoded_token: ', res.locals.decoded_token);

    const id = req.params.id;
    console.green(`[GET] /api/orders/user/${id}`);

    if ( id == res.locals.decoded_token.id ) {

      console.log('in if block');

      try {
          const rows = await db('users as u')
          .join('orders as o', 'u.id', 'o.user_id')
          .select(
            'o.id',
            'o.status',
            'o.total',
            'u.email',
            'o.created_at',
          )
          .where('u.id', id);

          res.status(201).json(rows);

      } catch (err) {
        res.status(400).json({ message: 'ERROR 400: Bad request'});
      }
    } else {
      res.status(401).json({ message: 'ERROR 401: Unauthorized. Users can only access their own account. You are trying to access orders for a user account different than your own.'});
    }
});

// ==============================================

// Allow any logged in user to getOrderByID

// Get order by ID
router.get('/:id', 
  authMiddleware.restricted,
  OrdersController.getOrderbyID
);

// ==============================================

// Create order
router.post('/', 
  authMiddleware.restricted,
  OrdersController.createOrder
);

// ==============================================

module.exports = router;