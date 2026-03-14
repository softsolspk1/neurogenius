
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/categories', questionController.getCategories);
router.post('/categories', authMiddleware, questionController.createCategory);
router.put('/categories/:id', authMiddleware, questionController.updateCategory);
router.delete('/categories/:id', authMiddleware, questionController.deleteCategory);

router.get('/', questionController.getQuestions);
router.post('/', authMiddleware, questionController.createQuestion);
router.put('/:id', authMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

router.get('/category/:categoryId', questionController.getQuestionsByCategory);

module.exports = router;
