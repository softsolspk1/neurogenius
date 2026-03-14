// Force inclusion of PostgreSQL driver for Vercel bundler
try {
  require('pg');
} catch (e) {
  console.warn('pg load failed early', e.message);
}

let app;
try {
  app = require('./server');
} catch (error) {
  console.error('BACKEND_INIT_ERROR:', error);
  const express = require('express');
  app = express();
  app.all('*', (req, res) => {
    res.status(500).json({ 
      error: 'Backend Initialization Failed', 
      message: error.message,
      stack: error.stack
    });
  });
}

module.exports = app;
