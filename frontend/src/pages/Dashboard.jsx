import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="glass card" style={{ flex: 1, minWidth: '200px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      <div style={{ padding: '0.75rem', background: `${color}20`, color: color, borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{title}</div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard icon={ListTodo} title="Total Tasks" value={stats.total} color="var(--primary)" />
        <StatCard icon={Clock} title="Pending" value={stats.pending} color="var(--warning)" />
        <StatCard icon={CheckCircle2} title="Completed" value={stats.completed} color="var(--success)" />
        <StatCard icon={AlertTriangle} title="Overdue" value={stats.overdue} color="var(--danger)" />
      </div>
    </div>
  );
};

export default Dashboard;
