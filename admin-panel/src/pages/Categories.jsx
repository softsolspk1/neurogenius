
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
    if (!window.confirm('Are you sure you want to delete this category? All associated questions will also be deleted.')) return;
    try {
      setLoading(true);
      await api.delete(`/api/questions/categories/${id}`);
      await fetchCategories();
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. This might be due to existing references.');
    } finally {
      setLoading(false);
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
                <tr key={cat.id} className="table-row-hover">
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {cat.id}</div>
                  </td>
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
                      color: 'var(--primary)',
                      border: '1px solid #dbeafe'
                    }}>
                      {cat.questionCount || 0} Questions
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="btn action-btn-edit" 
                        title="Edit Category"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="btn action-btn-delete" 
                        title="Delete Category"
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

      <style>{`
        .table-row-hover { transition: all 0.2s; border-bottom: 1px solid var(--border); }
        .table-row-hover:hover { background-color: #f8fafc; }
        .action-btn-edit, .action-btn-delete { 
          padding: 0.5rem; 
          border-radius: 8px; 
          border: 1px solid var(--border); 
          background: white; 
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-btn-edit:hover { background: #eff6ff; color: var(--primary); border-color: var(--primary); transform: translateY(-1px); }
        .action-btn-delete:hover { background: #fef2f2; color: #ef4444; border-color: #ef4444; transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default Categories;
