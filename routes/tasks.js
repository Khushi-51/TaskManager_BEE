const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();
let Task, redisClient, io;

setTimeout(() => {
  const mongoose = require('mongoose');
  Task = mongoose.model('Task');
}, 100);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Get all tasks with caching (Redis)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Try to get from cache
    const cacheKey = `tasks-${req.userId}`;
    
    // Get tasks from MongoDB with optimization
    const tasks = await Task.find({ userId: req.userId })
      .sort({ dueDate: 1, priority: -1 })
      .exec();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task with real-time update
router.post('/', verifyToken, [
  body('title').trim().notEmpty(),
  body('priority').isIn(['low', 'medium', 'high']),
  body('status').isIn(['todo', 'in-progress', 'completed'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = new Task({
      ...req.body,
      userId: req.userId,
      updatedAt: new Date()
    });

    await task.save();

    // Get app and io from require chain
    const app = require('../server');
    if (app.io) {
      app.io.to(`user-${req.userId}`).emit('task-created', task);
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    const app = require('../server');
    if (app.io) {
      app.io.to(`user-${req.userId}`).emit('task-updated', task);
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const app = require('../server');
    if (app.io) {
      app.io.to(`user-${req.userId}`).emit('task-deleted', req.params.id);
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter tasks by status, priority, category
router.get('/filter', verifyToken, async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    const filter = { userId: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
