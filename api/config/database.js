
const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('CRITICAL: DATABASE_URL is not defined in environment variables.');
}

const sequelize = new Sequelize(dbUrl || 'postgres://localhost:5432/placeholder', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 2,
    min: 0,
    idle: 10000,
    acquire: 30000
  },
  logging: false
});

module.exports = sequelize;
