const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const redis = require('redis');
require('dotenv').config();
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  dueDate: { type: Date },
  category: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ dueDate: 1 });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Routes (use the existing express routes for API endpoints)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Attach resources so routes can access them via require('../server')
app.io = io;
app.redisClient = redisClient;

// Health check endpoint for Docker / orchestration
app.get('/healthz', async (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;
  let redisReady = false;
  try {
    redisReady = !!(redisClient && redisClient.isOpen);
  } catch (e) {
    redisReady = false;
  }
  const ok = mongoReady && redisReady;
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'unhealthy', mongo: mongoReady, redis: redisReady });
});

// Prepare Next and start the server
nextApp.prepare().then(() => {
  // Let Next handle all other requests (pages, internal APIs)
  // Use a regex to match any path to avoid path-to-regexp parameter errors
  app.all(/.*/, (req, res) => handle(req, res));

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server (Next + Express) running on port ${PORT}`);
  });
});

// Export app so imported route modules can access `app.io` / `app.redisClient`
module.exports = app;
