const { required } = console;
const db = required('db/db-config');

// ==============================================

const getAllOrders = async () => { 
  return db('orders') 
};

// ==============================================

async function insertOrder({ user_id, status, cart }) {

  // -Step 1: Insert into orders table with { user_id, status }
  // -Step 2: Loop over line_items (elements of cart array) and insert into order_2_variants
  //          inserting a row with { order_id, variant_id, qty }, while accumulating the total.
  // -Step 3: Update orders row with total

  // Table              Row(s)
  // -----              ------
  // orders:            { user_id, total, status }
  // order_2_variants:  [{ order_id, variant_id, qty }]

  // console.blue('insertOrders()');

  // // Step 1:
  const [new_order] = await db('orders').insert({ user_id, status, total: 0 }, ['id', 'user_id', 'status', 'total']);
  const order_id = new_order.id;
  console.log('order_id: ', order_id, '\nnew_order: ', new_order);

  // Step 2:
  let total = 0;
  for (let i = 0; i < cart.length; ++i) {

    // const { id: product_id, title, body, category, price } = cart[i].product;
    const { price } = cart[i].product;
    const { qty } = cart[i];
    total += price * qty;
    console.log('total: ', total);

    // const { id: variant_id, size, color } = cart[i].variant;
    const { id: variant_id } = cart[i].variant;
    const line_item = { order_id, variant_id, qty };
    // console.log('line_item: ', line_item);

    const order_2_variants_row = await db('order_2_variants').insert(line_item, ['id', 'order_id', 'variant_id', 'qty']);
    console.log('order_2_variants_row: ', order_2_variants_row);
  }

  // Step 3:
  await updateTotal(order_id, total);

  return getByID(order_id); // { id: 7, title: 'Product A', body: 'Description of product A...' }
}

// ==============================================

async function getByID(id) {
  const row = await db('orders').where('id', id);
  return row;
}

// ==============================================


async function updateTotal(id, total) {
  const num_rows_updated = await db('orders')
    .where('id', Number(id))
    .update({ total }); // only need properties that we update
  return num_rows_updated;
}

// ==============================================

module.exports = {
  getAllOrders,
  insertOrder,
  getByID,
};
