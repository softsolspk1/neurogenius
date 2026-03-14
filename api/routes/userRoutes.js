
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.patch('/:id/status', authenticateToken, isAdmin, userController.updateUserStatus);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;
