exports.seed = function (knex) {
  
  // --------------------------------------------

  const order_2_variants = [
    {
      order_id: 1,
      variant_id: 1,
      qty: 2,
    },
    {
      order_id: 2,
      variant_id: 1,
      qty: 1,
    },
    {
      order_id: 2,
      variant_id: 2,
      qty: 1,
    },
  ];

  // --------------------------------------------

  return knex('order_2_variants').insert(order_2_variants);

  // --------------------------------------------
};