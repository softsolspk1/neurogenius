
const { User, Question, Category, sequelize } = require('./api/models');

async function checkCounts() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const userCount = await User.count();
    const activeDocCount = await User.count({ where: { role: 'doctor', status: 'active' } });
    const questionCount = await Question.count();
    const categoryCount = await Category.count();
    
    console.log(`Users Total: ${userCount}`);
    console.log(`Doctors Active: ${activeDocCount}`);
    console.log(`Questions Total: ${questionCount}`);
    console.log(`Categories Total: ${categoryCount}`);

    const cats = await Category.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('Questions.id')), 'qCount']],
      include: [{ model: Question, attributes: [] }],
      group: ['Category.id'],
      raw: true
    });
    
    console.log('Category breakdown:');
    cats.forEach(c => console.log(`- ${c.name}: ${c.qCount}`));

  } catch (error) {
    console.error('Check failed:', error);
  } finally {
    process.exit();
  }
}

checkCounts();
