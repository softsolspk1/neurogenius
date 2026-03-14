
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, UserCheck, UserMinus, Shield } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. John Smith', email: 'john@example.com', specialty: 'Neurology', hospital: 'City Hospital', status: 'active', points: 1245 },
    { id: 2, name: 'Dr. Sarah Wilson', email: 'sarah@example.com', specialty: 'Neuro Surgery', hospital: 'General Hospital', status: 'pending', points: 0 }
  ]);

  return (
    <div className="users-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Doctor Management</h1>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', width: '300px' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>Doctor Name</th>
              <th style={{ padding: '1rem' }}>Email / Specialty</th>
              <th style={{ padding: '1rem' }}>Hospital</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Points</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>
                   <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.specialty}</div>
                   <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{user.hospital}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    backgroundColor: user.status === 'active' ? '#dcfce7' : '#fef3c7',
                    color: user.status === 'active' ? '#166534' : '#92400e'
                  }}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: '700', color: '#1e40af' }}>{user.points}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button title="Approve" style={{ padding: '0.5rem', borderRadius: '0.4rem', border: 'none', backgroundColor: '#ecfdf5', color: '#10b981', cursor: 'pointer' }}>
                      <UserCheck size={18} />
                    </button>
                    <button title="Deactivate" style={{ padding: '0.5rem', borderRadius: '0.4rem', border: 'none', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}>
                      <UserMinus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
