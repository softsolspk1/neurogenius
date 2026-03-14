const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, notificationController.getNotifications);
router.post('/broadcast', authenticateToken, notificationController.createNotification);

module.exports = router;
