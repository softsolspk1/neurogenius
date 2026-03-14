
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Settings as SettingsIcon, Shield, Mail, Bell, Percent, Save, RotateCcw, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    appName: 'Neuro Genius Challenge',
    supportEmail: 'support@neurogenius.com',
    pointsPerCorrect: '10',
    quizTimer: '30',
    enableMultiplayer: 'true'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings');
      if (Object.keys(response.data).length > 0) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/settings/bulk', settings);
      setStatus({ type: 'success', text: 'All settings saved successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading system configuration...</div>;

  return (
    <div className="settings-page animate-fade-in">
      <div className="top-bar">
         <h1>System Settings</h1>
         <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)' }} onClick={() => fetchSettings()}>
               <RotateCcw size={18} /> Reset
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
               <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
         <div className="card glass-card" style={{ padding: '0.75rem', height: 'fit-content' }}>
            <div className="settings-nav-item active">
               <SettingsIcon size={20} /> <span style={{ fontWeight: '600' }}>General Branding</span>
            </div>
            <div className="settings-nav-item">
               <Percent size={20} /> <span style={{ fontWeight: '600' }}>Scoring & Game Logic</span>
            </div>
            <div className="settings-nav-item">
               <Shield size={20} /> <span style={{ fontWeight: '600' }}>Access Control</span>
            </div>
            <div className="settings-nav-item">
               <Mail size={20} /> <span style={{ fontWeight: '600' }}>Notification Templates</span>
            </div>
         </div>

         <div className="card">
            {status && (
              <div style={{ 
                padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                background: status.type === 'success' ? '#dcfce7' : '#fef2f2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600'
              }}>
                <CheckCircle size={20} /> {status.text}
              </div>
            )}

            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Application Identity</h2>
              <div className="form-grid">
                 <div className="form-group">
                    <label className="label">Application Name</label>
                    <input type="text" name="appName" className="input" value={settings.appName} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="label">Support Email Address</label>
                    <input type="email" name="supportEmail" className="input" value={settings.supportEmail} onChange={handleChange} />
                 </div>
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Quiz Configuration</h2>
              <div className="form-grid">
                 <div className="form-group">
                    <label className="label">Points Per Correct Answer</label>
                    <input type="number" name="pointsPerCorrect" className="input" value={settings.pointsPerCorrect} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="label">Quiz Question Timer (Sec)</label>
                    <input type="number" name="quizTimer" className="input" value={settings.quizTimer} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="label">Multiplayer Enabled</label>
                    <select name="enableMultiplayer" className="input" value={settings.enableMultiplayer} onChange={handleChange}>
                       <option value="true">YES - Enable Live Rooms</option>
                       <option value="false">NO - Maintain Local Only</option>
                    </select>
                 </div>
              </div>
            </div>
         </div>
      </div>

      <style>{`
        .settings-nav-item { padding: 1.25rem 1.5rem; border-radius: 12px; display: flex; gap: 1rem; alignItems: center; marginBottom: 0.5rem; cursor: pointer; color: var(--text-muted); transition: all 0.2s; }
        .settings-nav-item:hover { background: rgba(79, 70, 229, 0.05); color: var(--primary); }
        .settings-nav-item.active { background: #eff6ff; color: var(--primary); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      `}</style>
    </div>
  );
};

export default Settings;
