const { sequelize } = require('../backend/models');

module.exports = async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      message: 'Root API is working and DB is connected!', 
      timestamp: new Date(),
      node_version: process.version,
      db_status: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Root API is working but DB connection failed', 
      error: error.message,
      stack: error.stack
    });
  }
};
