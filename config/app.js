const path = require('path');

module.exports = {
  app: {
    name: 'BaseApp',
    rootDir: path.resolve(__dirname, '../'),
    tmpDir: path.resolve(__dirname, '../', 'tmp'),
  },
};
