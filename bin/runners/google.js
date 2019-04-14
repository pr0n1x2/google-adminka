const Maps = require('controllers/google');

const init = () => new Promise((resolve, reject) => {
    const maps = Maps.init();

    if (typeof maps === 'object') {
        console.log('Google maps object is created');
        resolve();
    } else {
        reject('Google maps was not created');
    }
});

module.exports = init;