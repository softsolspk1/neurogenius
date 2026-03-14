
const { Question, Category } = require('../models');
const { Sequelize } = require('sequelize');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: { 
        include: [[Sequelize.fn("COUNT", Sequelize.col("Questions.id")), "questionCount"]] 
      },
      include: [{ model: Question, attributes: [] }],
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update({ name, description });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { categoryId, search, limit = 50, page = 1 } = req.query;
    const where = {};
    if (categoryId) where.category_id = categoryId;
    if (search) {
      where.text = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Question.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['id', 'DESC']]
    });

    res.json({ total: count, questions: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 10 } = req.query;

    const questions = await Question.findAll({
      where: { category_id: categoryId },
      order: [Sequelize.fn('RANDOM')],
      limit: parseInt(limit)
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { text, options, correct_answer, category_id, difficulty, subtopic } = req.body;
    const question = await Question.create({ 
      text, options, correct_answer, category_id, difficulty, subtopic 
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, options, correct_answer, category_id, difficulty, subtopic } = req.body;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    await question.update({ 
      text, options, correct_answer, category_id, difficulty, subtopic 
    });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    await question.destroy();
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
