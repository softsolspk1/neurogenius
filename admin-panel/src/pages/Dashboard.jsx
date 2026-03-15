
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
        <p className="text-muted" style={{ marginTop: '-1rem' }}>Real Time Quiz Activity</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Questions by Category</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[0] }} />
               <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Categories</span>
            </div>
          </div>
          <div style={{ height: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1rem' }}
                  cursor={{ fill: 'rgba(79, 70, 229, 0.04)' }}
                />
                <Bar dataKey="questionCount" radius={[8, 8, 0, 0]} barSize={40}>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.25rem' }}>User Engagement</h2>
            <div style={{ height: 300, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: stats.approvedUsers },
                      { name: 'Pending', value: stats.totalUsers - stats.approvedUsers }
                    ]}
                    innerRadius={85}
                    outerRadius={115}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                     <Cell fill="#10b981" />
                     <Cell fill="rgba(255,255,255,0.08)" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ 
                position: 'absolute', textAlign: 'center' 
              }}>
                <p style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {stats.totalUsers > 0 ? Math.round((stats.approvedUsers / stats.totalUsers) * 100) : 0}%
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.1 }} />
        </div>
      </div>

      <div className="card" style={{ border: 'none', background: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Active Knowledge Domains</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '700' }}>View All Categories →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat, i) => (
            <div key={cat.id} style={{ 
              display: 'flex', flexDirection: 'column', padding: '1.5rem', 
              backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid var(--border)',
              transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }} className="category-hover-card">
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${COLORS[i % COLORS.length]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                 <HelpCircle size={20} style={{ color: COLORS[i % COLORS.length] }} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.5rem' }}>{cat.name}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: '800' }}>{cat.questionCount}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>Questions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .category-hover-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

export default Dashboard;
