
import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Monthly User Growth', type: 'PDF', date: '2026-03-01', size: '1.2 MB' },
    { id: 2, name: 'Question Bank Analysis', type: 'Excel', date: '2026-02-28', size: '4.5 MB' },
    { id: 3, name: 'Doctor Performance Report', type: 'PDF', date: '2026-02-15', size: '2.8 MB' }
  ]);

  return (
    <div className="reports-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Analytics & Reports</h1>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          backgroundColor: '#059669', color: 'white', border: 'none', 
          padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600'
        }}>
          <Plus size={18} /> Generate New Report
        </button>
      </div>

      <div className="stats-grid">
         <div className="card">
            <h3>Average Quiz Score</h3>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#1e40af', margin: '0.5rem 0' }}>78.4%</p>
            <span style={{ color: '#059669', fontWeight: '600' }}>↑ 4.2% from last month</span>
         </div>
         <div className="card">
            <h3>Active Sessions</h3>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', margin: '0.5rem 0' }}>142</p>
            <span style={{ color: '#64748b' }}>Current live players</span>
         </div>
      </div>

      <div className="card" style={{ padding: '0', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
           <h2>Downloadable Reports</h2>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                 <Calendar size={18} /> Last 30 Days
              </button>
           </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>Report Name</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Generated Date</th>
              <th style={{ padding: '1rem' }}>Size</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>
                   <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <FileText size={20} color="#64748b" />
                      {report.name}
                   </div>
                </td>
                <td style={{ padding: '1rem' }}>{report.type}</td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{report.date}</td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{report.size}</td>
                <td style={{ padding: '1rem' }}>
                  <button title="Download" style={{ padding: '0.5rem', borderRadius: '0.4rem', border: 'none', backgroundColor: '#eff6ff', color: '#1e40af', cursor: 'pointer' }}>
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Plus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default Reports;
