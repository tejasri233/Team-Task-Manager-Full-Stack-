const express = require('express');
const { createTask, getTasksByProject, updateTaskStatus, getDashboardStats } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, admin, createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.patch('/:id', protect, updateTaskStatus);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
