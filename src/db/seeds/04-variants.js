const { variants } = require('../csv/dist/seed-products');

// ==============================================

exports.seed = function (knex) {

  // --------------------------------------------

  return knex('variants').insert(variants);

  // --------------------------------------------
};

// ==============================================