const { add } = require('@cheton/monorepo-sandbox-x');
const { multiply } = require('@cheton/monorepo-sandbox-y');

const divide = (x, y) => {
  return x / y;
};

module.exports = {
  add,
  multiply,
  divide,
};
