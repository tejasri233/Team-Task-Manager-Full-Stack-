const Task = require('../models/Task');
const Project = require('../models/Project');

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
  const tasks = await Task.find({ projectId: req.params.projectId });
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
  const userId = req.user.id;
  const projects = await Project.find({ members: userId });
  const projectIds = projects.map(p => p.id);

  const tasks = await Task.find({ assignedTo: userId, projectIdIn: projectIds });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    pending: tasks.filter(t => t.status === 'Todo').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'Done').length
  };

  res.json(stats);
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, getDashboardStats };
