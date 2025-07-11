const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// SIGNUP route
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });
    res.json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', user: { email: user.email, role: user.role } });
});

// Change password route
router.put('/change-password', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.findOneAndUpdate({ email }, { password: hashed });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Delete user route
router.delete('/delete/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// ✅ GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
