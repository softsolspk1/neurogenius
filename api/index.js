console.log('Loading API Entry...');
let app;
try {
  app = require('./server');
  console.log('Server module loaded successfully');
} catch (error) {
  console.error('CRITCAL: Failed to load server module:', error.message);
  console.error(error.stack);
  
  // Fallback app to report errors
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
