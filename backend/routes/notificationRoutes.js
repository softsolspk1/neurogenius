
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all notifications for a user (broadcasts + specific)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        isAdminOnly: req.user.role === 'admin' ? [true, false] : false
      },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Broadcast a new message (Admin Only)
router.post('/broadcast', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type: type || 'broadcast',
      createdBy: req.user.id
    });

    // Emit via socket if io is available
    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_notification', notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
