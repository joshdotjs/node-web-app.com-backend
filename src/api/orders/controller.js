const { required } = console;
const db = required('db/db-config');

const OrdersModel = require('./model');

// ==============================================

async function getOrders(req, res) {

    console.log('[GET] /api/orders ');

    // Get all orders (no order details):
    //  -join orders and users tables
    //  -each row has this shape:
    //    { email, total, date, status }

    const rows = await db('users as u')
      .join('orders as o', 'u.id', 'o.user_id')
      .select(
        'o.id',
        'o.status',
        'o.total',
        'u.email',
        'o.created_at',
      );

    console.log('rows: ', rows);
    
    res.status(201).json(rows);
}

// ==============================================

async function getOrderbyID(req, res) {

  const { params } = req;
  const { id } = params;
  console.log('req.params', req.params);
  console.log('[GET] /api/orders/:id');
  console.log('id: ', id);

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
      // .orderBy('date_time_index', 'desc')
      // .limit(rows_per_page)
      // .offset(rows_per_page * page);
      .where('o.id', id);
    const order = rows[0];
  
    if (rows) {
      const products = await db('order_2_variants as o2')
        .join('variants as v', 'v.id', 'o2.variant_id')
        .join('products as p', 'p.id', 'v.product_id')
        .select(
          'p.id as product_id',
          'v.id as variant_id',
          'p.title',
          'p.body',
          'p.price',
          'o2.qty',
          'v.size',
          'v.color',
        )
        .where('o2.order_id', id);
    
      console.log('order: ', order);
      console.log('products: ', products);
    
      res.status(201).json({ order, products});        
    } else {
      res.status(404).json({ message: 'The product with the specified ID does not exist' });
    }
  } catch (er) {
    res.status(422).json({ message: 'Error 422: Unprocessable Entity' });
  }
}

// ==============================================

async function createOrder(req, res) {
    
  console.log('[POST]  /api/products');

  const { cart } = req.body;
  console.log('cart: ', cart);

  // -Step 0: Get user_id from the decoded token
  // -Step 1: Insert into orders table with { user_id, status}
  // -Step 2: Loop over line_items (elements of cart array) and insert into order_2_variants
  //          inserting a row with { order_id, variant_id, qty }, while accumulating the total.
  // -Step 3: Update orders row with total

  // Step 0:
  const { id: user_id, email, is_admin } = res.locals.decoded_token;
  // console.log('decoded token: ', res.locals.decoded_token);

  try {
    //   // Step 1, 2, 3:
    const new_order = await OrdersModel.insertOrder({ user_id, status: 1, cart });
    console.log('new_order: ', new_order);
      
    if (new_order) {
      res.status(201).json(new_order);
    } else {
      const message = 'Error in catch block of Create Order';
      console.red(message);
      res.status(500).json({ message });  
    }
  } catch(e) {
    const message = 'Error in catch block of Create Order';
    console.red(message);
    res.status(500).json({ message, error: e });
  }
}

// ==============================================

module.exports = {
  getOrders,
  getOrderbyID,
  createOrder
};