import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, UserPlus, CheckCircle2, Circle } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [memberEmail, setMemberEmail] = useState('');

  const fetchData = async () => {
    const p = await api.get(`/projects/${id}`);
    const t = await api.get(`/tasks/project/${id}`);
    setProject(p.data);
    setTasks(t.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}`, { status });
    fetchData();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        {currentUser?.role === 'ADMIN' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowMemberModal(true)} className="btn btn-secondary"><UserPlus size={20} /> Add Member</button>
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary"><Plus size={20} /> New Task</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass card">
          <h3>Tasks</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {tasks.map(t => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                <div onClick={() => updateStatus(t._id, t.status === 'Done' ? 'Todo' : 'Done')} style={{ cursor: 'pointer', color: t.status === 'Done' ? 'var(--success)' : 'var(--text-muted)' }}>
                  {t.status === 'Done' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', textDecoration: t.status === 'Done' ? 'line-through' : 'none' }}>{t.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.assignedTo?.name || 'Unassigned'}</div>
                </div>
                <select className="input" style={{ width: 'auto' }} value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="glass card">
          <h3>Members</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {project.members.map(m => (
              <div key={m._id} style={{ padding: '0.5rem 0' }}>{m.name} ({m.role})</div>
            ))}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2>New Task</h2>
            <form onSubmit={handleCreateTask} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Title</label>
                <input className="input" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Assign To</label>
                <select className="input" value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Select Member</option>
                  {project.members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Due Date</label>
                <input type="date" className="input" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2>Add Member</h2>
            <form onSubmit={handleAddMember} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Email</label>
                <input className="input" type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowMemberModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
