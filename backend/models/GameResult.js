
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameResult = sequelize.define('GameResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correct_answers: DataTypes.INTEGER,
  total_questions: DataTypes.INTEGER,
  time_spent: DataTypes.INTEGER, // in seconds
  game_mode: {
    type: DataTypes.ENUM('single', 'multiplayer'),
    defaultValue: 'single'
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = GameResult;
