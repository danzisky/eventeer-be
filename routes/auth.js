const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token,
      refreshToken,
    });
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

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ token, refreshToken });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      // Generate a new access token
      const newAccessToken = generateAccessToken(user);
      res.json({ token: newAccessToken });
    });
  } catch (error) {
    res.status(400).json({ message: 'Error refreshing token', error });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Find the user with the provided refresh token
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    // Invalidate the refresh token
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
});

module.exports = router;