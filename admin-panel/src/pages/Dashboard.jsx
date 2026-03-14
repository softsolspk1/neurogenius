
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, CheckCircle, HelpCircle, Trophy, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    totalQuestions: 0,
    totalPoints: 0
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, catRes] = await Promise.all([
          api.get('/api/stats/dashboard'),
          api.get('/api/questions/categories')
        ]);
        setStats(statsRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
      <p className="text-muted">Loading real-time overview...</p>
    </div>
  );

  return (
    <div className="dashboard animate-fade-in">
      <div className="top-bar">
        <h1>Dashboard Overview</h1>
        <p className="text-muted" style={{ marginTop: '-1rem' }}>Real-time system health and doctor activity</p>
      </div>
      
      <div className="stats-grid">
        <div className="card stat-card" style={{ color: '#4f46e5' }}>
          <div className="stat-label">Total Doctors</div>
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          <Users size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
        <div className="card stat-card" style={{ color: '#10b981' }}>
          <div className="stat-label">Approved Accounts</div>
          <div className="stat-value">{stats.approvedUsers.toLocaleString()}</div>
          <CheckCircle size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
        <div className="card stat-card" style={{ color: '#f59e0b' }}>
          <div className="stat-label">Total Questions</div>
          <div className="stat-value">{stats.totalQuestions.toLocaleString()}</div>
          <HelpCircle size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
        <div className="card stat-card" style={{ color: '#ef4444' }}>
          <div className="stat-label">Global Learning Pts</div>
          <div className="stat-value">{stats.totalPoints.toLocaleString()}</div>
          <Trophy size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card glass-card">
          <h2 style={{ marginBottom: '2rem' }}>Questions by Category</h2>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                />
                <Bar dataKey="questionCount" radius={[6, 6, 0, 0]}>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '2rem' }}>Approval Rate</h2>
          <div style={{ height: 350, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Approved', value: stats.approvedUsers },
                    { name: 'Pending', value: stats.totalUsers - stats.approvedUsers }
                  ]}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                   <Cell fill="#10b981" />
                   <Cell fill="#f1f5f9" stroke="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981', lineHeight: 1 }}>
                {stats.totalUsers > 0 ? Math.round((stats.approvedUsers / stats.totalUsers) * 100) : 0}%
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>Approved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Top Category Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat, i) => (
            <div key={cat.id} style={{ 
              display: 'flex', justifyContent: 'space-between', padding: '1.25rem', 
              backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                <span style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{cat.name}</span>
              </div>
              <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{cat.questionCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
