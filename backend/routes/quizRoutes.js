
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/session', auth, quizController.createSession);
router.get('/join/:pin', auth, quizController.joinSession);
router.get('/active', auth, quizController.getActiveSessions);

router.get('/leaderboard', quizController.getLeaderboard);
router.post('/submit', auth, quizController.submitResult);

module.exports = router;
