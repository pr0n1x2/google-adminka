const { logger } = require('logger');

const httpServer = require('./http');

const init = async () => {
  console.log('Init web servers');
  await httpServer();
};

module.exports = init;
