exports.seed = function (knex) {
  
  // --------------------------------------------

  const orders = [
    {
      user_id: 1,
      total: 200, // 2 * product A = 2 * 100 = 200
      status: 1,
    },
    {
      user_id: 2,
      total: 300, // product A + product B = 100 + 200 = 300
      status: 2,
    },
  ];

  // --------------------------------------------

  return knex('orders').insert(orders);

  // --------------------------------------------
  
};