
const { Category, Question, sequelize } = require('./models/index');
const { Sequelize } = require('sequelize');

async function testQuery() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    const categories = await Category.findAll({
      attributes: { 
        include: [[Sequelize.fn("COUNT", Sequelize.col("Questions.id")), "questionCount"]] 
      },
      include: [{ model: Question, attributes: [] }],
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });
    
    console.log('Categories found:', categories.length);
    if (categories.length > 0) {
      console.log('First category:', categories[0].toJSON());
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Query failed:', error);
    process.exit(1);
  }
}

testQuery();
