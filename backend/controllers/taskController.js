const Task = require('../models/Task');

const createTask = async (req, res) => {
  const { title, description, assignedTo, projectId, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    assignedTo,
    projectId,
    dueDate
  });
  res.status(201).json(task);
};

const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedTo', 'name email');
  res.json(tasks);
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

const getDashboardStats = async (req, res) => {
  const tasks = await Task.find({
    $or: [
      { assignedTo: req.user._id },
      { projectId: { $in: await getProjectIdsForUser(req.user._id) } }
    ]
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    pending: tasks.filter(t => t.status === 'Todo').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length
  };

  res.json(stats);
};

// Helper to get project IDs where user is a member
const getProjectIdsForUser = async (userId) => {
  const Project = require('../models/Project');
  const projects = await Project.find({ members: userId }).select('_id');
  return projects.map(p => p._id);
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, getDashboardStats };
