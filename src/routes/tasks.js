import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get tasks for project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { 
      project: req.params.projectId, 
      user: req.user._id 
    };
    
    if (status) {
      filter.status = status;
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, status, dueDate, project } = req.body;
    
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      project,
      user: req.user._id
    });
    
    await task.save();
    await task.populate('project');
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    ).populate('project');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;