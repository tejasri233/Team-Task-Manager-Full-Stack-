require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
require('./models');

const app = express();

// ✅ SIMPLE + SAFE CORS (no custom logic)
app.use(cors({
  origin: true,
  credentials: true
}));

// ✅ IMPORTANT: handle preflight BEFORE routes
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Root
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.sync();
    console.log('DB synced ✅');
  } catch (err) {
    console.error('DB error:', err.message);
  }
});