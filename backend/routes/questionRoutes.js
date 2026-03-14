
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/categories', questionController.getCategories);
router.get('/category/:categoryId', questionController.getQuestionsByCategory);

module.exports = router;
