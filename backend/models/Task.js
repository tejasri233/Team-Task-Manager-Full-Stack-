const { getPool } = require('../config/db');

async function populateTask(pool, task) {
  if (task.assigned_to) {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
      [task.assigned_to]
    );
    task.assignedTo = rows.length ? { ...rows[0], _id: rows[0].id } : null;
  } else {
    task.assignedTo = null;
  }
  task.projectId = task.project_id;
  task._id = task.id;
  return task;
}

const Task = {
  async create({ title, description, assignedTo, projectId, dueDate }) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, assigned_to, project_id, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, assignedTo || null, projectId, dueDate || null, 'Todo']
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    return populateTask(pool, rows[0]);
  },

  async find({ projectId, assignedTo, projectIdIn }) {
    const pool = getPool();
    let query;
    let params;

    if (projectId !== undefined) {
      query = 'SELECT * FROM tasks WHERE project_id = ?';
      params = [projectId];
    } else if (assignedTo !== undefined && projectIdIn !== undefined) {
      query = `SELECT * FROM tasks WHERE assigned_to = ? OR project_id IN (${projectIdIn.map(() => '?').join(',')})`;
      params = [assignedTo, ...projectIdIn];
    } else if (assignedTo !== undefined) {
      query = 'SELECT * FROM tasks WHERE assigned_to = ?';
      params = [assignedTo];
    } else {
      query = 'SELECT * FROM tasks';
      params = [];
    }

    const [rows] = await pool.query(query, params);
    return Promise.all(rows.map(t => populateTask(pool, t)));
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return null;
    const task = rows[0];
    task._id = task.id;
    task.projectId = task.project_id;
    // Attach a save method for status updates
    task.save = async () => {
      await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [task.status, task.id]);
      return task;
    };
    return task;
  },
};

module.exports = Task;
