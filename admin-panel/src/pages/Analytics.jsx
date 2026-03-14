
import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle, Loader2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/stats/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
      <p className="text-muted">Analyzing system performance...</p>
    </div>
  );

  return (
    <div className="analytics-page animate-fade-in">
      <div className="top-bar">
        <h1>Analytics Insights</h1>
        <p className="text-muted" style={{ marginTop: '-1rem' }}>User behavioral data and quiz performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card" style={{ color: 'var(--primary)' }}>
           <div className="stat-label">Engagement Rate</div>
           <div className="stat-value">{data?.overall?.engagement || '0%'}</div>
           <TrendingUp size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
        <div className="card stat-card" style={{ color: 'var(--secondary)' }}>
           <div className="stat-label">Average Score</div>
           <div className="stat-value">{data?.overall?.avgScore || 0}</div>
           <CheckCircle size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
        <div className="card stat-card" style={{ color: '#0891b2' }}>
           <div className="stat-label">Games Played</div>
           <div className="stat-value">{(data?.overall?.totalGames || 0).toLocaleString()}</div>
           <Users size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
        <div className="card stat-card" style={{ color: '#f59e0b' }}>
           <div className="stat-label">Growth Rate</div>
           <div className="stat-value">+12%</div>
           <Clock size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card glass-card">
          <h2 style={{ marginBottom: '2rem' }}>Weekly Game Activity</h2>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.activityData || []}>
                <defs>
                  <linearGradient id="colorGames" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="games" stroke="var(--primary)" fillOpacity={1} fill="url(#colorGames)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
           <h2 style={{ marginBottom: '2rem' }}>User Loyalty</h2>
           <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Active Daily</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)' }}>65%</span>
                 </div>
                 <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', backgroundColor: 'var(--primary)' }} />
                 </div>
              </div>
              
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Return Weekly</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--secondary)' }}>35%</span>
                 </div>
                 <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '100%', backgroundColor: 'var(--secondary)' }} />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '2rem' }}>Category Proficiency (Average Score)</h2>
        <div style={{ height: 350 }}>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data?.categoryPerformance || []} layout="vertical">
               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
               <XAxis type="number" fontSize={12} axisLine={false} tickLine={false} />
               <YAxis dataKey="name" type="category" fontSize={12} axisLine={false} tickLine={false} width={150} />
               <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
               <Bar dataKey="score" fill="var(--primary)" radius={[0, 8, 8, 0]} barSize={24} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
