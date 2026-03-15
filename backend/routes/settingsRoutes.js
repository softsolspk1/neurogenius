
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findAll();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update settings (Admin Only)
router.post('/bulk', async (req, res) => {
  try {
    const settingsData = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(settingsData)) {
      await Settings.upsert({ key, value: String(value) });
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
