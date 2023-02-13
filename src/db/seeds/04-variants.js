exports.seed = function (knex) {
  // --------------------------------------------

  const variants = [
    {
      product_id: 1, 
      size: 'lg',
      color: 'red',
      qty: 1,
    },
    {
      product_id: 1, 
      size: 'sm',
      color: 'red',
      qty: 1,
    },
    {
      product_id: 1, 
      size: 'lg',
      color: 'blue',
      qty: 1,
    },
    {
      product_id: 1, 
      size: 'sm',
      color: 'blue',
      qty: 1,
    },
    {
      product_id: 2, 
      size: 'lg',
      color: 'red',
      qty: 1,
    },
    {
      product_id: 2, 
      size: 'sm',
      color: 'red',
      qty: 1,
    },
    {
      product_id: 2, 
      size: 'lg',
      color: 'blue',
      qty: 1,
    },
    {
      product_id: 2, 
      size: 'sm',
      color: 'blue',
      qty: 1,
    },
];

  // --------------------------------------------



  // --------------------------------------------

  return knex('variants').insert(variants);

  // --------------------------------------------
};