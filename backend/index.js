require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
require('./models');

const app = express();

// ✅ FINAL CLEAN CORS (single middleware only)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('CORS Blocked:', origin);
    return callback(null, false);
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// ✅ Root
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// ✅ Start server FIRST (important for Railway)
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