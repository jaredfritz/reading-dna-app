const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const uploadRoutes = require('./routes/upload');
const analysisRoutes = require('./routes/analysis');
const recommendationRoutes = require('./routes/recommendations');
const evaluationRoutes = require('./routes/evaluation');
const preloadedRoutes = require('./routes/preloaded');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting for API calls (AI-powered endpoints only)
// 10 requests per hour
const hourlyLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'Too many requests. Maximum 10 API calls per hour allowed. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 50 requests per day
const dailyLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50,
  message: {
    error: 'Daily limit reached. Maximum 50 API calls per day allowed. Please try again tomorrow.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (with rate limiting on AI-powered endpoints)
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/recommendations', hourlyLimit, dailyLimit, recommendationRoutes);
app.use('/api/evaluation', hourlyLimit, dailyLimit, evaluationRoutes);
app.use('/api/preloaded', preloadedRoutes); // No rate limit for preloaded data

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reading DNA API is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
 
