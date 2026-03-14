
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Send, Bell, History, Info, AlertCircle, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('broadcast');
  const [history, setHistory] = useState([]);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/notifications');
      setHistory(res.data.notifications || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    setSending(true);
    try {
      await api.post('/api/notifications/broadcast', { title, message, type });
      setStatus({ type: 'success', text: 'Broadcast message sent successfully!' });
      setTitle('');
      setMessage('');
      fetchHistory();
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send broadcast.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="notifications-page animate-fade-in">
      <div className="top-bar">
        <h1>Global Notifications</h1>
        <div className="card glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} className="text-primary" />
          <span style={{ fontWeight: 700 }}>{history.length} Total Alerts</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
             <div style={{ padding: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '10px' }}>
                <Send size={20} className="text-primary" />
             </div>
             <h2>Broadcast Message</h2>
          </div>

          <form onSubmit={handleBroadcast}>
            <div className="form-group">
              <label className="label">Message Title</label>
              <input 
                className="input" 
                placeholder="e.g. New Quiz Category Available!" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Notification Content</label>
              <textarea 
                className="input" 
                rows="5" 
                placeholder="Write your message here... This will be sent to all doctors."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="form-group">
              <label className="label">Alert Type</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 {['broadcast', 'info', 'warning'].map(t => (
                   <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                     <input 
                       type="radio" 
                       name="type" 
                       value={t} 
                       checked={type === t}
                       onChange={(e) => setType(e.target.value)}
                     /> 
                     <span style={{ textTransform: 'capitalize' }}>{t}</span>
                   </label>
                 ))}
              </div>
            </div>

            {status && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.5rem',
                backgroundColor: status.type === 'success' ? '#dcfce7' : '#fef2f2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.text}
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
              <Send size={18} /> {sending ? 'Sending...' : 'Broadcast to All Users'}
            </button>
          </form>
        </div>

        <div className="card glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
             <div style={{ padding: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '10px' }}>
                <History size={20} className="text-primary" />
             </div>
             <h2>Broadcast History</h2>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                 <p>No broadcast history found.</p>
              </div>
            ) : (
              history.map(notif => (
                <div key={notif.id} style={{ 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border)', 
                  background: 'white',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: notif.type === 'broadcast' ? '#eff6ff' : '#fef3c7',
                      color: notif.type === 'broadcast' ? '#1e40af' : '#92400e'
                    }}>
                      {notif.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{notif.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
