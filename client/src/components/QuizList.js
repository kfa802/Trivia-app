import React, { useState, useEffect } from 'react';

function QuizList({ onBack, onSelect }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => { setQuizzes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}>
        ← Back
      </button>
      <h2>Custom quizzes</h2>

      {loading && <p>Loading quizzes...</p>}

      {!loading && quizzes.length === 0 && (
        <p style={{ color: '#888', marginTop: '1rem' }}>No quizzes saved yet! Go create one.</p>
      )}

      {quizzes.map((quiz) => (
        <div key={quiz.id} onClick={() => onSelect(quiz)}
          style={{ background: '#f7f7fb', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '1rem', marginTop: '10px', cursor: 'pointer', transition: 'border-color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6c63ff'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
        >
          <p style={{ fontWeight: '500', margin: 0 }}>{quiz.title || 'Untitled quiz'}</p>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>{quiz.questions.length} questions</p>
        </div>
      ))}
    </div>
  );
}

export default QuizList;