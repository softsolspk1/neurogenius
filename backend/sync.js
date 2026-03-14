
const { sequelize } = require('./models/index');

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

syncDB();
