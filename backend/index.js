const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ✅ CORS (clean + stable)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Middleware
app.use(express.json());

// DB Connection
const { connectDB, sequelize } = require('./config/db');
require('./models');

connectDB()
  .then(() => sequelize.sync())
  .then(() => {
    console.log('Database synced successfully ✅');
  })
  .catch(err => {
    console.error("DB Connection Failed:", err.message);
  });

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// ✅ Serve frontend (FIXED for Express v5)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');

  app.use(express.static(frontendPath));

  // ❌ removed app.get('*')
  // ✅ use fallback handler instead
  app.use((req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});