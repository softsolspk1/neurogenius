
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, Folder, HelpCircle, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/api/questions/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/api/questions/categories', formData);
      }
      fetchCategories();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All associated questions will need to be reassigned.')) return;
    try {
      await api.delete(`/api/questions/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  return (
    <div className="categories-page animate-fade-in">
      <div className="top-bar">
        <h1>Category Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <div className="stats-grid">
         <div className="card stat-card" style={{ color: 'var(--primary)' }}>
            <div className="stat-label">Total Categories</div>
            <div className="stat-value">{categories.length}</div>
            <Folder size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.2 }} />
         </div>
         <div className="card stat-card" style={{ color: 'var(--secondary)' }}>
            <div className="stat-label">Total Questions</div>
            <div className="stat-value">{categories.reduce((acc, cat) => acc + parseInt(cat.questionCount || 0), 0)}</div>
            <HelpCircle size={24} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.2 }} />
         </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
            <p className="text-muted">Loading categories...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1.25rem' }}>Category Name</th>
                <th style={{ padding: '1.25rem' }}>Description</th>
                <th style={{ padding: '1.25rem' }}>Questions</th>
                <th style={{ padding: '1.25rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>{cat.name}</td>
                  <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {cat.description || `Medical topics related to ${cat.name}`}
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '700',
                      backgroundColor: '#eff6ff',
                      color: 'var(--primary)'
                    }}>
                      {cat.questionCount} Qs
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="btn" 
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="btn" 
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Category Name</label>
            <input 
              className="input" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Neuroanatomy"
            />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea 
              className="input" 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of the category topics..."
              style={{ resize: 'none' }}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
