const { Sequelize } = require('sequelize');

module.exports = (req, res) => {
  try {
    res.json({ 
      message: 'Sequelize is available!', 
      node_version: process.version,
      sequelize_version: 'available'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
