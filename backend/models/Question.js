
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  correct_answer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtopic: DataTypes.STRING,
  reference: DataTypes.TEXT
}, {
  timestamps: true,
  underscored: true
});

module.exports = Question;
