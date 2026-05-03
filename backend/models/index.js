const { sequelize } = require('../config/db');

const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// Define associations

// User to Project (Creator)
User.hasMany(Project, { foreignKey: 'createdById', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// User to Project (Members - Many to Many)
const ProjectMembers = sequelize.define('ProjectMembers', {}, { timestamps: false });
User.belongsToMany(Project, { through: ProjectMembers, as: 'projects', foreignKey: 'userId' });
Project.belongsToMany(User, { through: ProjectMembers, as: 'members', foreignKey: 'projectId' });

// Project to Task
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User to Task (Assigned To)
User.hasMany(Task, { foreignKey: 'assignedToId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  ProjectMembers
};
