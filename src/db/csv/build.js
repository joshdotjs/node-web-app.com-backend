const fs = require('fs');
const path = require("path");
// const HTMLParser = require('node-html-parser');

// ==============================================

const build = ({ products, cols }) => {

  const head_open = '';
  const head_close = 'module.exports = { products, variants };';

  const product_rows = [];
  const variant_rows = [];
  for (let i = 0; i < products.length; ++i ) {
    product_rows.push(` {
      title:         "${products[i].product['title']}",
      sub_title:     "${products[i].product['sub_title']}",
      body:          "${products[i].product['body']}",
      category:      "${products[i].product['category']}",
      gender:        "${products[i].product['gender']}",
      price:          ${products[i].product['price'] * 100},
      price_compare:  ${products[i].product['price_compare'] * 100},
    },`);

  
    for (let j = 0; j < products[i].variants.length; ++j) {
      variant_rows.push(` {
    product_id:  ${i + 1},
    qty:         ${Number(products[i].variants[j]['qty'])},
    size:       "${products[i].variants[j]['size']}",
    color:      "${products[i].variants[j]['color']}",
    img:        "${products[i].variants[j]['img']}",
  },`);
    } // end for j

  } // end for i

  const output = `${head_open}

  // ==============================================

  // Products:

  const products = [${product_rows.join('\r\n')}];

  // ==============================================

  // Variants:

  const variants = [${variant_rows.join('\r\n')}];

  // ==============================================

${head_close}
`;

  console.blue('Writing .php...');
  const write_path = path.join(__dirname, "dist");
  if (!fs.existsSync(write_path))
    fs.mkdirSync(write_path);

  fs.writeFileSync(`${write_path}/seed-products.js`, output, err => {
    if (err)  console.err(err);
    else      console.log('file written successfully!')
  });

//   console.yellow('Copying file...');
//   fs.copyFile(`${write_path}/seed-products.js`, `${write_path}/../../seeds/seed-products.js`, () => {
//     console.green('File copied successfully.');
//   });
};

// ==============================================

module.exports = build;