exports.up = async (knex) => {
  
  await knex.schema
    .createTable('users', (tbl) => {
      tbl.increments('id');
      tbl.string('email', 200).notNullable();
      tbl.string('password', 200).notNullable();
      tbl.boolean('is_admin');
      tbl.timestamps(false, true);
    })
    .createTable('products', (tbl) => {
      tbl.increments('id');
      tbl.string('title', 200).notNullable();
      tbl.string('body', 200).notNullable();
      tbl.string('category', 200).notNullable();
      tbl.integer('price').notNullable();
      tbl.timestamps(false, true);
    })
    .createTable('variants', (tbl) => {
      tbl.increments('id');
      tbl.string('size', 200).notNullable();
      tbl.string('color', 200).notNullable();
      tbl.integer('qty').notNullable();
      tbl // Foreign-key (Products)
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.timestamps(false, true);
    })
    .createTable('orders', (tbl) => {
      tbl.increments('id');
      tbl.integer('total').notNullable();
      tbl.integer('status').notNullable(); // {1, 2, 3}
      tbl // Foreign-key (Users)
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        // .onDelete('CASCADE');
      tbl.timestamps(false, true);
    })
    .createTable('order_2_variants', (tbl) => {
      tbl.increments('id');
      tbl.integer('qty').notNullable();
      tbl // Foreign-key (Orders)
        .integer('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onUpdate('CASCADE')
        // .onDelete('CASCADE');
      tbl // Foreign-key (Products)
        .integer('variant_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('variants')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.timestamps(false, true);
    })
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('order_2_variants');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('variants');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('users');
};