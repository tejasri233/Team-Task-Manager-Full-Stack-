const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};



// ✅ REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 🔥 HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ✅ store hashed password
      role
    });

    res.status(201).json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// ✅ LOGIN
const loginUser = async (req, res) => {
  try {
    console.log("🔥 LOGIN HIT");

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 🔥 COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerUser, loginUser };