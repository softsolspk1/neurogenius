const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/categories', questionController.getCategories);
router.post('/categories', authenticateToken, questionController.createCategory);
router.put('/categories/:id', authenticateToken, questionController.updateCategory);
router.delete('/categories/:id', authenticateToken, questionController.deleteCategory);

router.get('/', questionController.getQuestions);
router.post('/', authenticateToken, questionController.createQuestion);
router.put('/:id', authenticateToken, questionController.updateQuestion);
router.delete('/:id', authenticateToken, questionController.deleteQuestion);

router.get('/category/:categoryId', questionController.getQuestionsByCategory);

module.exports = router;
