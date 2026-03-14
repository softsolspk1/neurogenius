
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Download, FileText, Calendar, Filter, Loader2, TrendingUp, CheckCircle, Gamepad2, UserCheck } from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const res = await api.get('/api/stats/analytics');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching report stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (reportName) => {
    alert(`Downloading ${reportName}... (Implementation pending backend PDF generation)`);
  };

  const STATIC_REPORTS = [
    { id: 1, name: 'Monthly User Growth', type: 'PDF', date: new Date().toLocaleDateString(), size: '1.2 MB' },
    { id: 2, name: 'Question Bank Analysis', type: 'Excel', date: new Date().toLocaleDateString(), size: '4.5 MB' },
    { id: 3, name: 'Doctor Performance Report', type: 'PDF', date: new Date().toLocaleDateString(), size: '2.8 MB' }
  ];

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
      <p className="text-muted">Aggregating system reports...</p>
    </div>
  );

  return (
    <div className="reports-page animate-fade-in">
      <div className="top-bar">
        <h1>Analytics & Reports</h1>
        <button className="btn btn-primary">
          <FileText size={18} /> Generate Custom Report
        </button>
      </div>

      <div className="stats-grid">
         <div className="card stat-card" style={{ color: 'var(--primary)' }}>
            <div className="stat-label">Average Quiz Score</div>
            <div className="stat-value">{stats?.overall?.avgScore || 0}%</div>
            <TrendingUp size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
         </div>
         <div className="card stat-card" style={{ color: 'var(--secondary)' }}>
            <div className="stat-label">Total Game Sessions</div>
            <div className="stat-value">{stats?.overall?.totalGames || 0}</div>
            <Gamepad2 size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
         </div>
         <div className="card stat-card" style={{ color: '#0891b2' }}>
            <div className="stat-label">User Engagement</div>
            <div className="stat-value">{stats?.overall?.engagement || '85%'}</div>
            <UserCheck size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.15 }} />
         </div>
      </div>

      <div className="card" style={{ padding: '0', marginTop: '2rem', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
           <h2 style={{ fontSize: '1.1rem' }}>Available System Reports</h2>
           <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                 <Calendar size={16} /> Last 30 Days
              </button>
              <button className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                 <Filter size={16} /> Filter
              </button>
           </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Report Name</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Generated Date</th>
              <th style={{ padding: '1rem' }}>Size</th>
              <th style={{ padding: '1rem 1.5rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {STATIC_REPORTS.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} />
                      </div>
                      {report.name}
                   </div>
                </td>
                <td style={{ padding: '1rem' }}>
                   <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', background: '#f1f5f9' }}>{report.type}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{report.date}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{report.size}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button 
                    onClick={() => handleDownload(report.name)}
                    className="btn" 
                    style={{ padding: '0.5rem', borderRadius: '8px', background: 'white', border: '1px solid var(--border)', color: 'var(--primary)' }}
                  >
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
         <h2 style={{ marginBottom: '1.5rem' }}>Category Proficiency (Real-Time Performance)</h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {stats?.categoryPerformance?.map((cat, i) => (
               <div key={i} style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                     <span style={{ fontWeight: 700 }}>{cat.name}</span>
                     <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{cat.score}% Success</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                     <div style={{ width: `${cat.score}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Reports;
