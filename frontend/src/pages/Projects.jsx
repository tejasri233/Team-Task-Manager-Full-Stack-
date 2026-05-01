import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/projects', { name, description });
    setShowModal(false);
    setName('');
    setDescription('');
    fetchProjects();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus size={20} /> New Project</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(p => (
          <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass card">
              <Folder size={24} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3>{p.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2>New Project</h2>
            <form onSubmit={handleCreate} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Description</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
