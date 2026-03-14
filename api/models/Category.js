
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: DataTypes.TEXT,
  icon_url: DataTypes.STRING
}, {
  timestamps: true,
  underscored: true
});

module.exports = Category;
