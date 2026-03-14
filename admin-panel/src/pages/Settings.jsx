
import React from 'react';
import { Settings as SettingsIcon, Shield, Mail, Bell, Percent } from 'lucide-react';

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>System Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
         <div className="card" style={{ padding: '0.5rem', height: 'fit-content' }}>
            <div style={{ padding: '1rem', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
               <SettingsIcon size={20} /> <span style={{ fontWeight: '600' }}>General</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
               <Percent size={20} /> <span style={{ fontWeight: '600' }}>Scoring System</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
               <Shield size={20} /> <span style={{ fontWeight: '600' }}>Admin Roles</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
               <Mail size={20} /> <span style={{ fontWeight: '600' }}>Email Settings</span>
            </div>
         </div>

         <div className="card">
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>General Settings</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                  <label style={{ fontWeight: '600', color: '#475569' }}>Application Name</label>
                  <input type="text" className="input-field" defaultValue="Neuro Genius Challenge" />
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                  <label style={{ fontWeight: '600', color: '#475569' }}>Support Email</label>
                  <input type="email" className="input-field" defaultValue="support@neurogenius.com" />
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                  <label style={{ fontWeight: '600', color: '#475569' }}>Points Per Correct Answer</label>
                  <input type="number" className="input-field" defaultValue="10" />
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                  <label style={{ fontWeight: '600', color: '#475569' }}>Quiz Timer (Seconds)</label>
                  <input type="number" className="input-field" defaultValue="30" />
               </div>

               <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary">Save Changes</button>
                  <button style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
