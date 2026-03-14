try {
  require('pg');
  require('pg-hstore');
} catch (e) {
  console.warn('pg driver load failed early', e.message);
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
