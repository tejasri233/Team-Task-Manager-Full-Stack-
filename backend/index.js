const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Safe DB connection
const connectDB = require('./config/db');
connectDB().catch(err => {
  console.error("DB Connection Failed:", err.message);
});

// Routes
try {
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/projects', require('./routes/projectRoutes'));
  app.use('/api/tasks', require('./routes/taskRoutes'));
} catch (err) {
  console.error("Route loading error:", err.message);
}

// Root route (IMPORTANT ✅)
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Serve frontend (optional)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');

  app.use(express.static(frontendPath));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

// Port
const PORT = process.env.PORT || 5000;

// CRITICAL FIX ✅
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});