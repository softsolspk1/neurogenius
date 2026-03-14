
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, isAdmin, statsController.getDashboardStats);
router.get('/analytics', authenticateToken, isAdmin, statsController.getAnalyticsStats);

module.exports = router;
