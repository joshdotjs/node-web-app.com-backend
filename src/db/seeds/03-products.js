const { products } = require('../csv/dist/seed-products');;

// ==============================================

exports.seed = function (knex) {
  // --------------------------------------------

  return knex('products').insert(products);

  // --------------------------------------------
};

// ==============================================