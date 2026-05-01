const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: [req.user._id]
  });
  res.status(201).json(project);
};

const getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
    .populate('createdBy', 'name email')
    .populate('members', 'name email role');
  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email');
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

const addMemberToProject = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);
  const user = await User.findOne({ email });

  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (project.members.includes(user._id)) {
    return res.status(400).json({ message: 'User already a member' });
  }

  project.members.push(user._id);
  await project.save();
  res.json(project);
};

module.exports = { createProject, getProjects, getProjectById, addMemberToProject };
