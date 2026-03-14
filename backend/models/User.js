
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  designation: DataTypes.STRING,
  specialty: DataTypes.STRING,
  hospital: DataTypes.STRING,
  pmdc_number: DataTypes.STRING,
  city: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'inactive'),
    defaultValue: 'pending'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  role: {
    type: DataTypes.ENUM('doctor', 'admin'),
    defaultValue: 'doctor'
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = User;
