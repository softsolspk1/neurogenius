// Force inclusion of PostgreSQL driver for Vercel bundler
try {
  require('pg');
} catch (e) {
  console.warn('pg load failed early', e.message);
}

const app = require('./server');
module.exports = app;
