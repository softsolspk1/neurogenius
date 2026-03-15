
const { QuizSession, Question, Category } = require('../models');
const crypto = require('crypto');

exports.createSession = async (req, res) => {
  try {
    const { category_id, scheduled_at } = req.body;
    
    // Generate a unique 6-digit PIN
    let pin;
    let existingSession;
    do {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
      existingSession = await QuizSession.findOne({ where: { pin } });
    } while (existingSession);

    const session = await QuizSession.create({
      pin,
      category_id,
      scheduled_at,
      status: 'scheduled',
      created_by: req.user ? req.user.id : null
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.joinSession = async (req, res) => {
  try {
    const { pin } = req.params;
    const session = await QuizSession.findOne({ 
      where: { pin, status: ['scheduled', 'active'] },
      include: [Category]
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Invalid or expired PIN' });
    }

    // Mark as active if it was scheduled
    if (session.status === 'scheduled') {
      session.status = 'active';
      await session.save();
    }

    // Fetch some random questions for the category
    const questions = await Question.findAll({
      where: { category_id: session.category_id },
      limit: 10,
      order: sequelize.random()
    });

    res.json({ success: true, session, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await QuizSession.findAll({
      where: { status: 'active' },
      include: [Category]
    });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.findAll({
      attributes: ['id', 'name', 'specialty', 'points', 'level'],
      order: [['points', 'DESC']],
      limit: 20
    });
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitResult = async (req, res) => {
  try {
    const { category_id, score, correct_answers, total_questions, game_mode } = req.body;
    const userId = req.user.id;

    // 1. Create Game Result
    await GameResult.create({
      user_id: userId,
      category_id,
      score,
      game_mode: game_mode || 'single'
    });

    // 2. Update User Points and Gamification
    const user = await User.findByPk(userId);
    if (user) {
      user.points += score;
      
      // Exp logic: 10 points = 100 EXP
      const expGained = score * 10;
      user.exp_points += expGained;

      // Level up logic (e.g., Level = floor(sqrt(exp) / 10) + 1)
      const newLevel = Math.floor(Math.sqrt(user.exp_points) / 10) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        // Optionally create a notification for level up
      }

      await user.save();
    }

    res.json({ success: true, points: user.points, level: user.level });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
