const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    createdBy: req.user.id,
    members: [req.user.id]
  });
  res.status(201).json(project);
};

const getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user.id });
  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
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

  const alreadyMember = project.members.some(m => m.id === user.id);
  if (alreadyMember) {
    return res.status(400).json({ message: 'User already a member' });
  }

  const updated = await Project.addMember(project.id, user.id);
  res.json(updated);
};

module.exports = { createProject, getProjects, getProjectById, addMemberToProject };
