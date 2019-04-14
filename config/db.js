module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/place',
    connect: {
      config: {
        autoIndex: false,
      },
      useNewUrlParser: true,
    },
  },
};
