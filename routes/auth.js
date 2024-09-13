const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: `Bearer ${token}` });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
});

// Protected Route
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

module.exports = router;
