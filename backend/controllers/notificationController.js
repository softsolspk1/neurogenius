
const { Notification } = require('../models');

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, target_user_id } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type,
      target_user_id
    });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // Get global notifications + user specific ones
    const notifications = await Notification.findAll({
      where: {
        [Op.or]: [
          { target_user_id: null },
          { target_user_id: req.user.id }
        ]
      },
      order: [['sent_at', 'DESC']],
      limit: 20
    });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
