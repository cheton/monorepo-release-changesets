const { add } = require('@cheton/monorepo-sandbox-x');

function multiply(x, y) {
  return x * y;
}

module.exports = {
  add: add,
  multiply: multiply,
};
