const { getPool } = require('../config/db');

// Helper: attach members array and populate fields onto a project row
async function populateProject(pool, project, { populateCreatedBy = false, populateMembers = false } = {}) {
  // Always load members list
  const [memberRows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role
     FROM project_members pm
     JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = ?`,
    [project.id]
  );
  project.members = memberRows.map(m => ({ ...m, _id: m.id }));

  if (populateCreatedBy) {
    const [creatorRows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
      [project.created_by]
    );
    project.createdBy = creatorRows.length ? { ...creatorRows[0], _id: creatorRows[0].id } : null;
  } else {
    project.createdBy = project.created_by;
  }

  project._id = project.id;
  return project;
}

const Project = {
  async create({ name, description, createdBy, members }) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
      [name, description || null, createdBy]
    );
    const projectId = result.insertId;

    // Add initial members
    if (members && members.length) {
      for (const userId of members) {
        await pool.query(
          'INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)',
          [projectId, userId]
        );
      }
    }

    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    return populateProject(pool, rows[0]);
  },

  async find({ members: userId }) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT p.* FROM projects p
       JOIN project_members pm ON pm.project_id = p.id
       WHERE pm.user_id = ?`,
      [userId]
    );
    return Promise.all(rows.map(p => populateProject(pool, p, { populateCreatedBy: true, populateMembers: true })));
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return null;
    return populateProject(pool, rows[0], { populateCreatedBy: true, populateMembers: true });
  },

  async addMember(projectId, userId) {
    const pool = getPool();
    await pool.query(
      'INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)',
      [projectId, userId]
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? LIMIT 1', [projectId]);
    return populateProject(pool, rows[0], { populateCreatedBy: true, populateMembers: true });
  },
};

module.exports = Project;
