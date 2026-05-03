const { Project, User } = require('../models');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      createdById: req.user.id
    });
    // Add creator as a member
    await project.addMember(req.user.id);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Project,
        as: 'projects',
        include: [
          { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] }
        ]
      }
    });
    
    // Add _id backward compatibility for frontend
    const projects = user.projects.map(p => {
      const pData = p.toJSON();
      pData._id = pData.id;
      if (pData.members) pData.members.forEach(m => m._id = m.id);
      if (pData.createdBy) pData.createdBy._id = pData.createdBy.id;
      return pData;
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (project) {
      const pData = project.toJSON();
      pData._id = pData.id;
      if (pData.members) pData.members.forEach(m => m._id = m.id);
      if (pData.createdBy) pData.createdBy._id = pData.createdBy.id;
      res.json(pData);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMemberToProject = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findByPk(req.params.id);
    const user = await User.findOne({ where: { email } });

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMember = await project.hasMember(user);
    if (isMember) {
      return res.status(400).json({ message: 'User already a member' });
    }

    await project.addMember(user);
    
    const updatedProject = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    const pData = updatedProject.toJSON();
    pData._id = pData.id;
    if (pData.members) pData.members.forEach(m => m._id = m.id);
    if (pData.createdBy) pData.createdBy._id = pData.createdBy.id;
    res.json(pData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, addMemberToProject };
