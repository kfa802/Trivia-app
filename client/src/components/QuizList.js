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
    <div style={{
      width: '700px',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '1.5rem',
      boxSizing: 'border-box',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80vh'
    }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '0.3rem',
          color: '#6c63ff'
        }}>
          Your Quizzes
        </h2>

        <p style={{
          color: '#666',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Manage, play or share your created quizzes
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>

        {loading && <p>Loading quizzes...</p>}

        {!loading && quizzes.length === 0 && (
          <p style={{ color: '#888' }}>
            No quizzes saved yet! Go create one.
          </p>
        )}

        {quizzes.map((quiz) => (
        <div key={quiz.id} className="quiz-card"> 

            <div onClick={() => onSelect(quiz)} style={{ flex: 1, cursor: 'pointer' }}>
              <p style={{ fontWeight: '700', margin: 0, color: '#ffffff' }}>
                {quiz.title || 'Untitled quiz'}
              </p>
              <p style={{ color: '#ffffff', fontSize: '0.85rem', margin: '4px 0 0' }}>
                {quiz.questions.length} questions
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => copyId(quiz.id, e)}
                style={{
                  background: copied === quiz.id ? '#28a745' : '#1368ce',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {copied === quiz.id ? 'Copied' : 'Share'}
              </button>

              <button
                onClick={() => onEdit(quiz)}
                style={{
                  background: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Edit
              </button>

              <button
                onClick={(e) => deleteQuiz(quiz.id, e)}
                style={{
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Bottom back button */}
      <button
        onClick={onBack}
        style={{
          marginTop: '1.5rem',
          background: '#2c3285',
          color: 'white',
          border: 'none',
          padding: '12px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600'
        }}
      >
        ← Back
      </button>

    </div>
  );
}

export default QuizList;