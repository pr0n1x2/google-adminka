const port = require('config').get('server:port');
const expressCallback = require('httpServer');

expressCallback.set('port', port);

module.exports = expressCallback;
