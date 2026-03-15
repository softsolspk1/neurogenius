const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/categories', questionController.getCategories);
router.post('/categories', questionController.createCategory);
router.put('/categories/:id', questionController.updateCategory);
router.delete('/categories/:id', questionController.deleteCategory);

router.get('/', questionController.getQuestions);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

router.get('/category/:categoryId', questionController.getQuestionsByCategory);

module.exports = router;
