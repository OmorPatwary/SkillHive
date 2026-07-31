const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes'); // 👈 ১. এখানে jobRoutes ইমপোর্ট করা হলো

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', matchRoutes);
app.use('/api', bookingRoutes);
app.use('/api', profileRoutes);
app.use('/api/jobs', jobRoutes); // 👈 ২. এখানে /api/jobs রুট যুক্ত করা হলো

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillhive';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Database Connected Successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });