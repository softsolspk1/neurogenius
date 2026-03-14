
const { Question, Category } = require('../models');
const { Sequelize } = require('sequelize');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: { 
        include: [[Sequelize.fn("COUNT", Sequelize.col("Questions.id")), "questionCount"]] 
      },
      include: [{ model: Question, attributes: [] }],
      group: ['Category.id']
    });
    res.json(categories);
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
