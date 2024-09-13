const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const dotenv = require('dotenv');

dotenv.config();
require('./config/passport')(passport);

const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
