
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Question = require('./Question');
const GameResult = require('./GameResult');
const Notification = require('./Notification');
const QuizSession = require('./QuizSession');
const Settings = require('./Settings');

// Relationships
Category.hasMany(Question, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Question.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(GameResult, { foreignKey: 'user_id' });
GameResult.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(GameResult, { foreignKey: 'category_id', onDelete: 'CASCADE' });
GameResult.belongsTo(Category, { foreignKey: 'category_id' });

Category.hasMany(QuizSession, { foreignKey: 'category_id', onDelete: 'CASCADE' });
QuizSession.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Question,
  GameResult,
  Notification,
  QuizSession,
  Settings
};
