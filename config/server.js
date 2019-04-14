
// Normalize a port into a number, string, or false.
const normalizePort = (val) => {
  if (typeof val === 'undefined') {
    return false;
  }

  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    throw new Error(`Port ${val} incorect`);
  }

  if (port >= 0) {
    // port number
    return port;
  }

  throw new Error(`Port ${val} incorect`);
};

const port = normalizePort(process.env.PORT) || 8000;

module.exports = {
  server: {
    port,
  },
};
