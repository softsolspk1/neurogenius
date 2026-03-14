
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const Analytics = () => {
  const activityData = [
    { name: 'Week 1', users: 400, games: 2400 },
    { name: 'Week 2', users: 900, games: 4500 },
    { name: 'Week 3', users: 1500, games: 8900 },
    { name: 'Week 4', users: 1200, games: 15247 },
  ];

  const categoryPerformance = [
    { name: 'Neuroanatomy', score: 82 },
    { name: 'Neurology', score: 75 },
    { name: 'Neuropharmacology', score: 68 },
    { name: 'Neuroscience', score: 90 },
    { name: 'Biochemistry', score: 72 },
  ];

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>
      <p style={{ color: '#64748b', marginTop: '-1.5rem', marginBottom: '2rem' }}>Comprehensive insights and performance metrics</p>

      <div className="stats-grid">
        <div className="card stat-card">
           <div className="stat-icon" style={{ backgroundColor: '#1e40af' }}>
             <TrendingUp size={24} />
           </div>
           <div className="stat-info">
             <h3>User Engagement</h3>
             <p>89%</p>
           </div>
        </div>
        <div className="card stat-card">
           <div className="stat-icon" style={{ backgroundColor: '#059669' }}>
             <CheckCircle size={24} />
           </div>
           <div className="stat-info">
             <h3>Success Rate</h3>
             <p>76%</p>
           </div>
        </div>
        <div className="card stat-card">
           <div className="stat-icon" style={{ backgroundColor: '#0891b2' }}>
             <Users size={24} />
           </div>
           <div className="stat-info">
             <h3>Games Played</h3>
             <p>15,247</p>
           </div>
        </div>
        <div className="card stat-card">
           <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
             <Clock size={24} />
           </div>
           <div className="stat-info">
             <h3>Avg. Session</h3>
             <p>4.2m</p>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h2>User Activity (Last 30 Days)</h2>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorGames" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="games" stroke="#1e40af" fillOpacity={1} fill="url(#colorGames)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
           <h2>Game Modes</h2>
           <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontWeight: '600' }}>Single Player</span>
                 <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>65%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                 <div style={{ width: '65%', height: '100%', backgroundColor: '#1e40af', borderRadius: '4px' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontWeight: '600' }}>Multiplayer</span>
                 <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>35%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                 <div style={{ width: '35%', height: '100%', backgroundColor: '#059669', borderRadius: '4px' }} />
              </div>
           </div>
        </div>
      </div>

      <div className="card">
        <h2>Category Performance (Avg. Success Rate)</h2>
        <div style={{ height: 300 }}>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={categoryPerformance} layout="vertical">
               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
               <XAxis type="number" fontSize={12} axisLine={false} tickLine={false} />
               <YAxis dataKey="name" type="category" fontSize={12} axisLine={false} tickLine={false} width={150} />
               <Tooltip />
               <Bar dataKey="score" fill="#0891b2" radius={[0, 4, 4, 0]} barSize={20} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
