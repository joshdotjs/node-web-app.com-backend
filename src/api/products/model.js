const db = require('../../db/db-config');

// ==============================================

const getAllProducts = async () => { 
  return db('products') 
};

// ==============================================

const getAllProductsAndVariants = async () => { 

  const products = await db('products');

  for (let i = 0; i < products.length; ++i) {
    const product = products[i];
    const variants = await db('variants')
      .where({ product_id: product.id });
    product.variants = variants;
  }

  return products;
};
// ==============================================

const getProductById = async (id) => {
  const products = await db('products')
    .where({ id: Number(id) })
    .first();
  return products;
};

// ==============================================

const getVariantsByProductId = async (id) => {
  const variants = await db('variants')
    .where({ product_id: Number(id) });
  return variants;
};

// ==============================================

async function insertProduct({ product, variants }) {

  console.log('insertProduct() - product: ', product);

  // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
  // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
  const [new_product] = await db('products').insert(product, ['id', 'title', 'body', 'price', 'category']);

  console.log('new_product: ', new_product);

  const product_id = new_product.id;

  for (let i = 0; i < variants.length; ++i) {
    const variant = { ...variants[i], product_id };
    await db('variants').insert(variant, ['id', 'product_id', 'size', 'color', 'qty']);
  }

  return new_product; // { id: 7, title: 'Product A', body: 'Description of product A...' }
}

// ==============================================

async function update(id, product) {

  const { title, body, category, price } = product;
  console.log('product: ', product);

  const num_items_updated = await db('products')
    .where('id', Number(id))
    .update({ title, body, category, price });
  return num_items_updated;
}

// ==============================================

async function remove(id) {
  console.log('remove');
  const to_be_deleted = await getProductById(id);
  console.log('products-model --> to_be_deleted: ', to_be_deleted);
  await db('products').where('id', Number(id)).del();
  return to_be_deleted;
}

// ==============================================

module.exports = {
  getAllProducts,
  getAllProductsAndVariants,
  getProductById,
  insertProduct,
  getVariantsByProductId,
  update,
  remove
};
