
const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== 'production') {
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_U8Ejka3cJQuG@ep-winter-forest-an45zb98-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
if (!process.env.DATABASE_URL) {
  console.log('Using hardcoded DATABASE_URL fallback for production restoration.');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false // Disable SSL in development
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
