exports.seed = function (knex) {
  // --------------------------------------------

  const product_1 = {
    title: 'Product A', 
    body: 'Description of product A...',
    category: 'shirts',
    price: 100,
  };

  // --------------------------------------------

  const product_2 = {
    title: 'Product B', 
    body: 'Description of product B...',
    category: 'shoes',
    price: 200,
  };

  // --------------------------------------------

  return knex('products').insert([product_1, product_2]);

  // --------------------------------------------
};