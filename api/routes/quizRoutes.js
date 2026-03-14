
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/session', authenticateToken, quizController.createSession);
router.get('/join/:pin', authenticateToken, quizController.joinSession);
router.get('/active', authenticateToken, quizController.getActiveSessions);

router.get('/leaderboard', quizController.getLeaderboard);
router.post('/submit', authenticateToken, quizController.submitResult);

module.exports = router;
