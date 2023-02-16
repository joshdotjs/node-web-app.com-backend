const { required } = console;
const express = require('express');
const router = express.Router();
const db = required('db/db-config');
// const authMiddleware = require(src`/api/auth/middleware`);
const authMiddleware = required(`api/auth/middleware`);
const ProductsModel = require('./model');

// ==============================================

// Get all products
router.get('/', async (req, res) => {

  console.log('[GET] /api/products ');
  
  const { products, num_products } = await ProductsModel.getAllProductsAndVariants({ limit: 6, offset: 0 });

  res.status(201).json({ products, num_products });
});

// ==============================================

// Create product
router.post('/', 
  authMiddleware.restricted,
  authMiddleware.admin,
  async (req, res) => {

  console.log('[POST] /api/products ');

  const {
    title,
    body,
    price,
    category,
    variants,
  } = req.body;

  console.log('title: ', title, '\nbody: ', body, '\nprice: ', price, '\ncategory: ', category, '\nvariants: ', variants);

  try {
    const new_product = await ProductsModel.insertProduct({ product: { title, body, price, category }, variants });
    console.log('new_product: ', new_product);
    
    if (new_product) {
      // -Get updated products:
      const products = await ProductsModel.getAllProducts();
      // 200: the request has succeeded.
      // 201: the request has succeeded and has led to the creation of a resource.  
      // 400: Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error.
      // 401: Unauthorized response status code indicates that the client request has not been completed because it lacks valid authentication credentials for the requested resource.
      // 404: Not Found response status code indicates that the server cannot find the requested resource.
      // 422: Unprocessable Entity response status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
      // 500: Internal Server Error server error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
      // 501: Not Implemented server error response code means that the server does not support the functionality required to fulfill the request.
      res.status(201).json(products); 
    } else {
      res.status(500).json({ message: 'Error creating new product', error: e });  
    }
  } catch(e) {
    res.status(500).json({ message: 'Error in catch block of Create Product', error: e });
  }
});

// ==============================================

// Get product by ID
router.get('/:id', async (req, res) => {

  console.log('[GET] /api/product/[id] ');

  const { params } = req;
  const { id } = params;

  try {
    const product = await ProductsModel.getProductById(id);
    const variants = await ProductsModel.getVariantsByProductId(id);

    console.log('product: ', product);
    res.status(200).json({ product, variants });
  } catch (er) {
    res.status(422).json({ message: 'Error 422: Unprocessable Entity' });
  }

});

// ==============================================

// Update product
router.put('/:id', 
  authMiddleware.restricted,
  authMiddleware.admin,
  async (req, res) => {
    console.log('[PUT]  /api/products/:id');

    const id = req.params.id;
    const product = req.body;

    console.log('id: ', id);
    console.log('product: ', product);

    try {
      const num_rows_updated = await ProductsModel.update(id, product);
  
      console.log('num_rows_updated: ', num_rows_updated);

      if (num_rows_updated) {
        console.log('Successful modification of product');
        // -Get updated products:
        const products = await ProductsModel.getAllProducts();
        res.status(201).json(products);
      } else {
        res.status(404).json({ message: 'The product with the specified ID does not exist' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error in catch block of Update Product', error: e });
    }
});

// ==============================================

// Delete product
router.delete('/:id',
  authMiddleware.restricted,
  authMiddleware.admin,
  async function (req, res) {
    const id = req.params.id;
    console.log(`[DELETE]  /api/products/${id}`);
  
    try {
      const deleted_product = await ProductsModel.remove(id);

      console.log('deleted_product: ', deleted_product);
  
      if (!deleted_product) {
        res.status(404).json({ message: 'The product with the specified ID does not exist' });
      }

      console.log('Successful deletion of product');
      // -Get updated products:
      const products = await ProductsModel.getAllProducts();
      res.status(201).json(products);
    
    } catch (err) {
      res.status(500).json({ message: 'The product could not be deleted' });
    }
  }, 
);

// ==============================================

module.exports = router;