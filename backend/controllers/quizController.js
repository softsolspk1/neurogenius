
const { GameResult, User, sequelize } = require('../models');
const { Sequelize } = require('sequelize');

exports.submitResult = async (req, res) => {
  try {
    const { category_id, score, correct_answers, total_questions, time_spent, game_mode } = req.body;
    const user_id = req.user.id; // From authMiddleware

    const result = await GameResult.create({
      user_id, category_id, score, correct_answers, total_questions, time_spent, game_mode
    });

    // Update user's total points
    await User.increment('points', { by: score, where: { id: user_id } });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'points', 'specialty', 'hospital'],
      order: [['points', 'DESC']],
      limit: 50
    });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
