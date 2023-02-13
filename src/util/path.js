const path = require('path');

const path_obj = path.parse(__dirname);
const dir = path_obj.dir;

const required = (x) => require(`${dir}/${x}`);

console.required = required;