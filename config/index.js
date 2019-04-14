const nconf = require('nconf');
const path = require('path');
const fs = require('fs-extra');

nconf.env();

const configFiles = fs.readdirSync(__dirname).filter((file) => {
  if (path.extname(file) !== '.js' || path.basename(file) === 'index.js') {
    return false;
  }

  return true;
});

configFiles.forEach((filename) => {
  const configName = path.basename(filename, '.js');
  const filepath = path.resolve(__dirname, filename);
  const store = require(filepath);

  nconf.add(configName, {
    type: 'literal',
    store,
  });
});

module.exports = nconf;
