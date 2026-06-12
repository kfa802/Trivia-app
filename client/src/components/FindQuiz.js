import React, { useState } from 'react';

function FindQuiz({ onBack, onFound }) {
  const [quizId, setQuizId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const findQuiz = async () => {
    if (!quizId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/quizzes/${quizId.trim()}`);
      const data = await res.json();
      if (data.error) {
        setError('Quiz not found. Check the ID and try again.');
      } else {
        onFound(data);
      }
    } catch {
      setError('Could not connect to server.');
    }
    setLoading(false);
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
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    }}>

      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        color: '#6c63ff',
        marginBottom: '0.5rem',
        textAlign: 'center'
      }}>
        Play a Friend’s Quiz
      </h2>

      <p style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '1.5rem'
      }}>
        Enter the quiz ID your friend shared with you to start playing instantly.
      </p>

      <label style={{ fontWeight: '700', display: 'block', marginBottom: '6px' }}>
        Quiz ID
      </label>

      <input
        type="text"
        value={quizId}
        onChange={(e) => setQuizId(e.target.value)}
        placeholder="Paste quiz ID here..."
        onKeyDown={(e) => e.key === 'Enter' && findQuiz()}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: '2px solid #ddd',
          fontSize: '1rem',
          marginBottom: '12px',
          outline: 'none'
        }}
      />

      {error && (
        <p style={{ color: '#e53e3e', fontWeight: '600' }}>
          {error}
        </p>
      )}

      <button
        onClick={findQuiz}
        disabled={loading}
        style={{
          width: '100%',
          background: '#6c63ff',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '10px'
        }}
      >
        {loading ? 'Searching...' : 'Find Quiz'}
      </button>

      {/* BACK BUTTON NOW NORMAL POSITION */}
      <button
        onClick={onBack}
        style={{
          width: '100%',
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

export default FindQuiz;