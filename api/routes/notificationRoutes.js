const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', auth, notificationController.getNotifications);
router.post('/broadcast', auth, notificationController.createNotification);

module.exports = router;
