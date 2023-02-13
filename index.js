require('./src/util/path');
require('./src/util/console');
require('dotenv').config();

const server = require('./src/api/server');

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`http://localhost:${port}`)
});