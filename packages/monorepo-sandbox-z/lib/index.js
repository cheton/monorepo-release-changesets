const { add, subtract } = require('@cheton/monorepo-sandbox-x');
const { multiply } = require('@cheton/monorepo-sandbox-y');

const divide = (x, y) => {
  return x / y;
};

module.exports = {
  add,
  subtract,
  multiply,
  divide,
};
