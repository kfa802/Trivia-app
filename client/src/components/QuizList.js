import React, { useState, useEffect } from 'react';

function QuizList({ onBack, onSelect, onEdit, token }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  const fetchQuizzes = () => {
    fetch('/api/quizzes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => { setQuizzes(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const deleteQuiz = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this quiz?')) return;
    await fetch(`/api/quizzes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchQuizzes();
  };

  const copyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="card" style={{ width: '700px', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box', background: '#1e3560' }}>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
          Your <span style={{ color: '#6c63ff' }}>Quizzes</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: '500' }}>
          Manage, play or share your created quizzes
        </p>
      </div>

      {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading quizzes...</p>}

      {!loading && quizzes.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>No quizzes saved yet — go create one!</p>
      )}

      {quizzes.map((quiz) => (
        <div key={quiz.id}
          onClick={() => onSelect(quiz)}
          style={{ background: 'rgba(108,99,255,0.2)', border: '1.5px solid #6c63ff', borderRadius: '10px', padding: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(108,99,255,0.35)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(108,99,255,0.2)'}
        >
          <div>
            <p style={{ fontWeight: '700', margin: 0, color: 'white' }}>{quiz.title || 'Untitled quiz'}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '4px 0 0' }}>{quiz.questions.length} questions</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={(e) => copyId(quiz.id, e)}
              style={{ background: copied === quiz.id ? '#28a745' : '#6c63ff', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', width: 'auto', transition: 'background 0.2s' }}>
              {copied === quiz.id ? 'ID copied!' : 'Share'}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onEdit(quiz); }}
              style={{ background: '#26890c', color: 'white', border: '1px solid #6c63ff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', width: 'auto' }}>
              Edit
            </button>
            <button onClick={(e) => deleteQuiz(quiz.id, e)}
              style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', width: 'auto' }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <button onClick={onBack} className="btn-back" style={{ marginTop: '10px' }}>
        Back
      </button>
    </div>
  );
}

export default QuizList;