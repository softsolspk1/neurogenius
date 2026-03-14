
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, Folder, HelpCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/questions/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categories-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Category Management</h1>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <div className="stats-grid">
         <div className="card stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#1e40af' }}>
              <Folder size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Categories</h3>
              <p>{categories.length}</p>
            </div>
         </div>
         <div className="card stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#059669' }}>
              <HelpCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Questions</h3>
              <p>{categories.reduce((acc, cat) => acc + parseInt(cat.questionCount), 0)}</p>
            </div>
         </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem' }}>Category Name</th>
              <th style={{ padding: '1rem' }}>Icon / Description</th>
              <th style={{ padding: '1rem' }}>Questions Count</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ padding: '1rem', fontWeight: '600' }}>{cat.name}</td>
                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                  Medical category for {cat.name} questions.
                </td>
                <td style={{ padding: '1rem', fontWeight: '700', color: '#1e40af' }}>{cat.questionCount}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    backgroundColor: '#dcfce7',
                    color: '#166534'
                  }}>
                    ACTIVE
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button title="Edit" style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', background: 'white' }}>
                      <Edit size={16} />
                    </button>
                    <button title="Delete" style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444' }}>
                      <Trash2 size={16} />
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

export default Categories;
