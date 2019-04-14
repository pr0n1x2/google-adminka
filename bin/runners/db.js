const mongoose = require('mongoose');
const { logger } = require('logger');
const db = require('storage/db');

const uri = require('config').get('db:uri');
const options = require('config').get('db:connect');

const init = () => new Promise((resolve, reject) => {
  mongoose.connect(uri, options);

  db.once('error', (err) => {
    reject(err);
  });

  db.once('open', () => {
    db.on('error', (err) => {
      console.log(err);
    });

    console.log('Connected to DB');

    resolve();
  });

  db.once('close', () => {
    console.log('Close connected to DB');
  });
});

module.exports = init;
