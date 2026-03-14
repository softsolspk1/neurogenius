
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, CheckCircle, HelpCircle, Trophy } from 'lucide-react';

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
        // Update total questions from the sum of categories if possible
        const total = response.data.reduce((acc, cat) => acc + parseInt(cat.questionCount), 0);
        setStats(prev => ({ ...prev, totalQuestions: total }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Quick Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3>Categories Distribution</h3>
            <div style={{ marginTop: '1rem' }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                  <span>{cat.name}</span>
                  <span style={{ fontWeight: '600' }}>{cat.questionCount} Qs</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
             <p style={{ color: '#64748b' }}>Chart visualization coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
