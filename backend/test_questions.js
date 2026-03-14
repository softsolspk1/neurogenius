
const { Question, sequelize } = require('./models/index');
const { Sequelize } = require('sequelize');

async function testQuestions() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    // Test count all
    const total = await Question.count();
    console.log('Total Questions in DB:', total);
    
    // Test controller logic
    const { count, rows } = await Question.findAndCountAll({
      limit: 10,
      offset: 0,
      order: [['id', 'DESC']]
    });
    
    console.log('Fetched Questions:', rows.length);
    console.log('Count reported:', count);
    
    process.exit(0);
  } catch (error) {
    console.error('Query failed:', error);
    process.exit(1);
  }
}

testQuestions();
