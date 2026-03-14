
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const statsRoutes = require('./routes/statsRoutes');

const http = require('http');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketHandler(server);
const quizRoutes = require('./routes/quizRoutes');
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// Lazy-load database connection middleware
app.use(async (req, res, next) => {
  try {
    // Only authenticate once
    if (!sequelize.is_connected) {
      await sequelize.authenticate();
      sequelize.is_connected = true;
      console.log('Database connected!');
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue anyway to allow non-DB routes to work
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is responding!', 
    timestamp: new Date(),
    db_connected: !!sequelize.is_connected,
    env: process.env.NODE_ENV
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Neuro Genius API is running' });
});

module.exports = app;
