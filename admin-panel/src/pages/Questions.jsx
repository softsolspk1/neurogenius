
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Filter, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/api/questions/categories');
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0].id);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchQuestions = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/questions/category/${selectedCategory}?limit=20`);
          setQuestions(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
      };
      fetchQuestions();
    }
  }, [selectedCategory]);

  return (
    <div className="questions-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Question Bank</h1>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          backgroundColor: '#1e40af', color: 'white', border: 'none', 
          padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600'
        }}>
          <Plus size={18} /> Add New Question
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by question text..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
            />
         </div>
         <select 
           value={selectedCategory} 
           onChange={(e) => setSelectedCategory(e.target.value)}
           style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '200px' }}
         >
           {categories.map(cat => (
             <option key={cat.id} value={cat.id}>{cat.name} ({cat.questionCount})</option>
           ))}
         </select>
      </div>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map(q => (
            <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#475569' }}>{q.subtopic}</span>
                   <span style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#0369a1' }}>{q.difficulty.toUpperCase()}</span>
                </div>
                <p style={{ fontWeight: '600', color: '#1e293b', lineHeight: '1.5', marginBottom: '1rem' }}>{q.text}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{ 
                      fontSize: '0.875rem', padding: '0.5rem', borderRadius: '4px',
                      backgroundColor: String.fromCharCode(65 + i) === q.correct_answer ? '#dcfce7' : '#f8fafc',
                      border: String.fromCharCode(65 + i) === q.correct_answer ? '1px solid #10b981' : '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontWeight: '700', marginRight: '0.5rem' }}>{String.fromCharCode(65 + i)}:</span> {opt}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1.5rem' }}>
                <button style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}><Edit size={16} /></button>
                <button style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
