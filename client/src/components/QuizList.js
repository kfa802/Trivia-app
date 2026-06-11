import React, { useState, useEffect } from 'react';

function QuizList({ onBack, onSelect, onEdit, token }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ width: '700px', maxWidth: '100%', margin: '0 auto', padding: '1rem', boxSizing: 'border-box' }}>
      <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' }}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '1rem' }}>Custom quizzes</h2>

      {loading && <p>Loading quizzes...</p>}

      {!loading && quizzes.length === 0 && (
        <p style={{ color: '#888' }}>No quizzes saved yet! Go create one.</p>
      )}

      {quizzes.map((quiz) => (
        <div key={quiz.id}
          style={{ background: 'white', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => onSelect(quiz)} style={{ flex: 1, cursor: 'pointer' }}>
            <p style={{ fontWeight: '500', margin: 0 }}>{quiz.title || 'Untitled quiz'}</p>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>{quiz.questions.length} questions</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => onEdit(quiz)}
              style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Edit
            </button>
            <button onClick={(e) => deleteQuiz(quiz.id, e)}
              style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuizList;