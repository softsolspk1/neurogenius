
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Plus, Edit, Trash2, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correct_answer: 'A',
    category_id: '',
    difficulty: 'medium',
    subtopic: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [page, selectedCategory, search]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/questions/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
      }
    } catch (err) { console.error(err); }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (selectedCategory) params.categoryId = selectedCategory;
      const res = await api.get('/api/questions', { params });
      setQuestions(res.data.questions);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleOpenModal = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        text: question.text,
        options: [...question.options],
        correct_answer: question.correct_answer,
        category_id: question.category_id,
        difficulty: question.difficulty,
        subtopic: question.subtopic || ''
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        text: '',
        options: ['', '', '', ''],
        correct_answer: 'A',
        category_id: categories.length > 0 ? categories[0].id : '',
        difficulty: 'medium',
        subtopic: ''
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingQuestion) {
        await api.put(`/api/questions/${editingQuestion.id}`, formData);
      } else {
        await api.post('/api/questions', formData);
      }
      fetchQuestions();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question permanently?')) return;
    try {
      await api.delete(`/api/questions/${id}`);
      fetchQuestions();
    } catch (err) { console.error(err); }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="questions-page animate-fade-in">
      <div className="top-bar">
        <h1>Question Bank</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Question
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
           <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
              <input 
                className="input" 
                style={{ paddingLeft: '3rem' }} 
                placeholder="Search through 10,000+ questions..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
           </div>
           <select 
             className="input" 
             style={{ width: '250px' }}
             value={selectedCategory}
             onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
           >
             <option value="">All Categories</option>
             {categories.map(cat => (
               <option key={cat.id} value={cat.id}>{cat.name}</option>
             ))}
           </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
             <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          </div>
        ) : questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
             <p className="text-muted">No questions found matching your criteria.</p>
          </div>
        ) : (
          questions.map(q => (
            <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {categories.find(c => String(c.id) === String(q.category_id))?.name || 'Unknown'}
                   </span>
                   <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {q.difficulty}
                   </span>
                   {q.subtopic && (
                     <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', background: '#eff6ff', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {q.subtopic}
                     </span>
                   )}
                </div>
                <h3 style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>{q.text}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {q.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    const isCorrect = label === q.correct_answer;
                    return (
                      <div key={i} style={{ 
                        padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem',
                        background: isCorrect ? '#ecfdf5' : '#f8fafc',
                        border: isCorrect ? '1px solid #10b981' : '1px solid var(--border)',
                        color: isCorrect ? '#065f46' : 'var(--text-main)',
                        fontWeight: isCorrect ? '700' : '400'
                      }}>
                        <span style={{ fontWeight: 800, marginRight: '0.5rem' }}>{label}:</span> {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <button onClick={() => handleOpenModal(q)} className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem' }}>
                   <Edit size={16} />
                 </button>
                 <button onClick={() => handleDelete(q.id)} className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem', color: '#ef4444' }}>
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
         <button 
           className="btn" 
           disabled={page === 1} 
           onClick={() => setPage(page - 1)}
           style={{ background: 'white', border: '1px solid var(--border)' }}
         >
           <ChevronLeft size={18} /> Previous
         </button>
         <span style={{ fontWeight: 700 }}>Page {page} of {Math.ceil(total / 10)}</span>
         <button 
           className="btn" 
           disabled={page >= Math.ceil(total / 10)} 
           onClick={() => setPage(page + 1)}
           style={{ background: 'white', border: '1px solid var(--border)' }}
         >
           Next <ChevronRight size={18} />
         </button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingQuestion ? 'Edit Question' : 'Add New Question'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Question Text</label>
            <textarea 
              className="input" 
              required 
              rows="4"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              style={{ resize: 'none' }}
              placeholder="Enter the medical question..."
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
               <label className="label">Category</label>
               <select className="input" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
               <label className="label">Difficulty</label>
               <select className="input" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
               </select>
            </div>
          </div>

          <div className="form-group">
             <label className="label">Subtopic (Optional)</label>
             <input className="input" value={formData.subtopic} onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })} placeholder="e.g. Clinical Signs" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
             <label className="label">Options & Correct Answer</label>
             {formData.options.map((opt, i) => (
               <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div 
                    onClick={() => setFormData({ ...formData, correct_answer: String.fromCharCode(65 + i) })}
                    style={{ 
                      width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontWeight: 800,
                      background: formData.correct_answer === String.fromCharCode(65 + i) ? 'var(--primary)' : '#f1f5f9',
                      color: formData.correct_answer === String.fromCharCode(65 + i) ? 'white' : 'var(--text-muted)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <input 
                    className="input" 
                    required 
                    value={opt} 
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
               </div>
             ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Questions;
