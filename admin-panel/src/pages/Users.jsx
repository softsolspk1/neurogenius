
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, UserCheck, UserMinus, Shield, Trash2, Mail, MapPin, Plus, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    designation: 'Doctor',
    specialty: '',
    hospital: '',
    city: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/users/${id}/status`, { status: newStatus });
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/auth/signup', formData);
      setModalOpen(false);
      fetchUsers();
      setFormData({
        name: '', email: '', password: 'password123',
        designation: 'Doctor', specialty: '', hospital: '', city: ''
      });
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page animate-fade-in">
      <div className="top-bar">
        <h1>Doctor Management</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email or specialty..." 
              className="input"
              style={{ paddingLeft: '3rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Add New Doctor
          </button>
        </div>
      </div>

      <div className="card glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
             <p className="text-muted">Loading doctors data...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Doctor Details</th>
                <th>Professional Info</th>
                <th>Location</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }} className="text-muted">
                    No doctors found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ 
                           width: 44, height: 44, borderRadius: '12px', background: 'var(--bg-main)', 
                           display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)',
                           border: '1px solid var(--border)'
                         }}>
                           {user.name.charAt(0)}
                         </div>
                         <div>
                            <div style={{ fontWeight: '700' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               <Mail size={12} /> {user.email}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td>
                       <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user.specialty || 'General'}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.hospital || 'Not specified'}</div>
                    </td>
                    <td>
                       <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} className="text-muted" /> {user.city || 'N/A'}
                       </div>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status || 'PENDING'}
                      </span>
                    </td>
                    <td>
                       <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{user.points || 0} pts</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {user.status !== 'active' && (
                          <button 
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="action-btn approve" 
                            title="Approve Doctor"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        {user.status === 'active' && (
                          <button 
                            onClick={() => handleStatusChange(user.id, 'inactive')}
                            className="action-btn deactivate" 
                            title="Deactivate Account"
                          >
                            <UserMinus size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="action-btn delete" 
                          title="Delete Permanently"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Add New Doctor"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Full Name</label>
              <input 
                className="input" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Ahmed"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Email Address</label>
              <input 
                className="input" 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@example.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Specialty</label>
              <select 
                className="input"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              >
                <option value="">Select Specialty</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Neurosurgeon">Neurosurgeon</option>
                <option value="Psychiatrist">Psychiatrist</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">City</label>
              <select 
                className="input"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="">Select City</option>
                {[
                  'Abbottabad', 'Ahmedpur East', 'Attock', 'Bahawalnagar', 'Bahawalpur', 'Burewala', 
                  'Chakwal', 'Chaman', 'Chiniot', 'Chishtian', 'Dera Ghazi Khan', 'Dera Ismail Khan', 
                  'Faisalabad', 'Ferozewala', 'Gojra', 'Gujranwala', 'Gujrat', 'Hafizabad', 'Haripur',
                  'Hub', 'Hyderabad', 'Islamabad', 'Jacobabad', 'Jaranwala', 'Jhang', 'Jhelum', 
                  'Kamalia', 'Kamoke', 'Karachi', 'Kasur', 'Kharan', 'Khanewal', 'Khanpur', 'Khuzdar', 
                  'Kohat', 'Kot Addu', 'Lahore', 'Larkana', 'Layyah', 'Mardan', 'Mianwali', 'Mirpur', 
                  'Mirpur Khas', 'Multan', 'Murree', 'Muzaffarabad', 'Muzaffargarh', 'Nawabshah', 
                  'Nowshera', 'Okara', 'Pakpattan', 'Peshawar', 'Quetta', 'Rahim Yar Khan', 'Rawalpindi', 
                  'Sadiqabad', 'Sahiwal', 'Sambrial', 'Sargodha', 'Sheikhupura', 'Shikarpur', 'Sialkot', 
                  'Sukkur', 'Swabi', 'Tando Adam', 'Taxila', 'Umerkot', 'Vehari', 'Wah Cantt', 'Wazirabad', 'Zhob'
                ].sort().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Hospital / Clinic</label>
            <input 
              className="input" 
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              placeholder="e.g. CHK"
            />
          </div>

          <div className="form-group">
            <label className="label">Temporary Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="input" 
                value={formData.password}
                readOnly
                style={{ background: '#f8fafc', paddingRight: '1rem' }}
              />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Default password is <strong>password123</strong>. The doctor can change it later.
            </p>
          </div>

          <button className="btn btn-primary" style={{ height: '48px', marginTop: '0.5rem' }} disabled={submitting}>
            {submitting ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="animate-spin" /> Saving Account...
              </div>
            ) : 'Create Doctor Account'}
          </button>
        </form>
      </Modal>

      <style>{`
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { background: #f8fafc; padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .status-badge.active { background: #dcfce7; color: #15803d; }
        .status-badge.pending { background: #fef3c7; color: #9a3412; }
        .status-badge.inactive { background: #f1f5f9; color: #475569; }
        .action-btn { padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border); background: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .action-btn.approve:hover { background: #ecfdf5; color: #059669; border-color: #059669; }
        .action-btn.deactivate:hover { background: #fff7ed; color: #f59e0b; border-color: #f59e0b; }
        .action-btn.delete:hover { background: #fef2f2; color: #ef4444; border-color: #ef4444; }
      `}</style>
    </div>
  );
};

export default Users;
