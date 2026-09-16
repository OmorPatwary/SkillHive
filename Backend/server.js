const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

// Models
const Conversation = require('./models/Conversation');

// Routes
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://skillhive-app.vercel.app',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('SkillHive Backend API is running successfully!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api', bookingRoutes);
app.use('/api', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io Logic
io.on('connection', (socket) => {
  socket.on('register_user', async (userId) => {
    try {
      if (!userId) return;

      const userRoom = userId.toString();
      socket.join(userRoom);

      const conversations = await Conversation.find({
        members: userId,
      }).select('_id');

      conversations.forEach((conversation) => {
        socket.join(conversation._id.toString());
      });

      socket.emit('socket_connected', {
        userId: userId.toString(),
      });
    } catch (error) {
      console.error('Socket registration error:', error.message);
    }
  });

  socket.on('join_room', (conversationId) => {
    if (!conversationId) return;
    socket.join(conversationId.toString());
  });

  socket.on('leave_room', (conversationId) => {
    if (!conversationId) return;
    socket.leave(conversationId.toString());
  });

  socket.on('typing', (data) => {
    if (!data?.conversationId || !data?.sender) return;
    socket.to(data.conversationId.toString()).emit('user_typing', {
      sender: data.sender,
    });
  });

  socket.on('stop_typing', (data) => {
    if (!data?.conversationId || !data?.sender) return;
    socket.to(data.conversationId.toString()).emit('user_stopped_typing', {
      sender: data.sender,
    });
  });

  socket.on('disconnect', () => {});
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'File size is too large!',
    });
  }

  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillhive';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server & Socket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });