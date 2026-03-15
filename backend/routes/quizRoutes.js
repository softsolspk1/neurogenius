
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/session', quizController.createSession);
router.get('/join/:pin', quizController.joinSession);
router.get('/active', quizController.getActiveSessions);

router.get('/leaderboard', quizController.getLeaderboard);
router.post('/submit', quizController.submitResult);

module.exports = router;
