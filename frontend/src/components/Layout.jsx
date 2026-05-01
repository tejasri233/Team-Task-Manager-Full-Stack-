import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar glass" style={{ width: '280px', height: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0 }}>
      <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '3rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <FolderKanban size={32} />
        Task Manager
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <FolderKanban size={20} /> Projects
        </NavLink>
      </nav>

      <div className="user-profile" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
