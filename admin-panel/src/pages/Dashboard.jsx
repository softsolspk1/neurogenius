
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, CheckCircle, HelpCircle, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    approvedUsers: 1156,
    totalQuestions: 10000,
    totalPoints: 45892
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/questions/categories');
        setCategories(response.data);
        const total = response.data.reduce((acc, cat) => acc + parseInt(cat.questionCount), 0);
        setStats(prev => ({ ...prev, totalQuestions: total }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const COLORS = ['#1e40af', '#059669', '#0891b2', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#1e40af' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#059669' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Approved Doctors</h3>
            <p>{stats.approvedUsers}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#0891b2' }}>
            <HelpCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Questions</h3>
            <p>{stats.totalQuestions}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dc2626' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Score</h3>
            <p>{stats.totalPoints}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h2>Question Distribution</h2>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
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
          <h2>User Engagement</h2>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: 85 },
                    { name: 'Inactive', value: 15 }
                  ]}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                   <Cell fill="#059669" />
                   <Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '-180px' }}>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>85%</p>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Active Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Topic Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: '600' }}>{cat.name}</span>
              <span style={{ color: '#1e40af', fontWeight: '700' }}>{cat.questionCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
