const colors = {
  red: '\x1b[31m%s\x1b[0m',
  green:  '\x1b[32m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
  blue: '\x1b[34m%s\x1b[0m',
  magenta: '\x1b[35m%s\x1b[0m',
  cyan: '\x1b[36m%s\x1b[0m',
};

console.red = (x) => console.log(colors.red, x);
console.green = (x) => console.log(colors.green, x);
console.yellow = (x) => console.log(colors.yellow, x);
console.blue = (x) => console.log(colors.blue, x);
console.magenta = (x) => console.log(colors.magenta, x);
console.cyan = (x) => console.log(colors.cyan, x);