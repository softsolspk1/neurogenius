
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');

const http = require('http');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);
socketHandler(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

// Quiz & Leaderboard
const quizController = require('./controllers/quizController');
const authMiddleware = require('./middleware/authMiddleware');
app.get('/api/leaderboard', quizController.getLeaderboard);
app.post('/api/quiz/submit', authMiddleware, quizController.submitResult);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Neuro Genius API is running' });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
