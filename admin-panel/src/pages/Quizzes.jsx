
import React, { useState, useEffect } from 'react';
import { Play, Plus, Trash2, Hash, Calendar, Clock } from 'lucide-react';
import api from '../api';

const Quizzes = () => {
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({
    category_id: '',
    scheduled_at: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, categoriesRes] = await Promise.all([
        api.get('/quizzes/active'),
        api.get('/categories')
      ]);
      setSessions(sessionsRes.data.sessions || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes/session', newSession);
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Failed to create session');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Ward Activities</h1>
          <p className="page-subtitle">Manage PIN-based quizzes and sessions</p>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Create Session
        </button>
      </header>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : (
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {sessions.map(session => (
            <div key={session.id} className="stat-card quiz-card">
              <div className="quiz-card-header">
                <div className="pin-badge">
                  <Hash size={16} />
                  <span>{session.pin}</span>
                </div>
                <span className={`status-badge ${session.status}`}>{session.status}</span>
              </div>
              <h3 className="quiz-name">{session.Category?.name}</h3>
              <div className="quiz-meta">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="empty-state">No active sessions found.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Ward Activity</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newSession.category_id} 
                  onChange={e => setNewSession({...newSession, category_id: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Schedule Time (Optional)</label>
                <input 
                  type="datetime-local" 
                  value={newSession.scheduled_at}
                  onChange={e => setNewSession({...newSession, scheduled_at: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="primary-button">Generate PIN</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .quiz-card { padding: 1.5rem; }
        .quiz-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .pin-badge { display: flex; alignItems: center; gap: 0.5rem; background: var(--primary-light); color: var(--primary); padding: 0.5rem 1rem; border-radius: 999px; font-weight: 700; font-size: 1.25rem; }
        .status-badge { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 4px; }
        .status-badge.active { background: #d1fae5; color: #065f46; }
        .status-badge.scheduled { background: #fef3c7; color: #92400e; }
        .quiz-name { margin: 0 0 1rem 0; font-size: 1.25rem; }
        .quiz-meta { display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.875rem; }
        .meta-item { display: flex; align-items: center; gap: 0.25rem; }
      `}</style>
    </div>
  );
};

export default Quizzes;
