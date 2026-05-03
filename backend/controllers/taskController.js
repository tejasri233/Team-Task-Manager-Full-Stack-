const { Task, Project, User } = require('../models');
const { Op } = require('sequelize');

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      assignedToId: assignedTo || null,
      projectId,
      dueDate: dueDate || null
    });
    
    const tData = task.toJSON();
    tData._id = tData.id;
    res.status(201).json(tData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }]
    });
    const tasksData = tasks.map(t => { const d = t.toJSON(); d._id = d.id; return d; });
    res.json(tasksData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (task) {
      task.status = status;
      await task.save();
      const tData = task.toJSON();
      tData._id = tData.id;
      res.json(tData);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const projectIds = await getProjectIdsForUser(req.user.id);
    
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { assignedToId: req.user.id },
          { projectId: { [Op.in]: projectIds } }
        ]
      }
    });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Done').length,
      pending: tasks.filter(t => t.status === 'Todo').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to get project IDs where user is a member
const getProjectIdsForUser = async (userId) => {
  const user = await User.findByPk(userId, {
    include: { model: Project, as: 'projects', attributes: ['id'] }
  });
  return user ? user.projects.map(p => p.id) : [];
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, getDashboardStats };
