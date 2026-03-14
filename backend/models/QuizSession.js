
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizSession = sequelize.define('QuizSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pin: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'active', 'completed'),
    defaultValue: 'scheduled'
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true // Admin ID
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = QuizSession;
