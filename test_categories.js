
const { Category, Question, sequelize } = require('./api/models');
const { Sequelize } = require('sequelize');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    const categories = await Category.findAll({
      attributes: { 
        include: [[Sequelize.fn("COUNT", Sequelize.col("Questions.id")), "questionCount"]] 
      },
      include: [{ model: Question, attributes: [] }],
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });

    console.log('Categories found:', categories.length);
    categories.forEach(c => {
      console.log(`- ${c.name} (ID: ${c.id}, Questions: ${c.dataValues.questionCount})`);
    });

  } catch (err) {
    console.error('Query failed:', err);
  } finally {
    process.exit();
  }
}

test();
