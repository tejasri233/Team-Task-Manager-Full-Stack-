const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');

const User = {
  async findOne({ email }) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!rows.length) return null;
    const user = rows[0];
    user.matchPassword = async (enteredPassword) => bcrypt.compare(enteredPassword, user.password);
    return user;
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return null;
    const user = rows[0];
    user.matchPassword = async (enteredPassword) => bcrypt.compare(enteredPassword, user.password);
    return user;
  },

  async create({ name, email, password, role }) {
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = role || 'MEMBER';
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );
    return { id: result.insertId, _id: result.insertId, name, email, role: userRole };
  },
};

module.exports = User;
