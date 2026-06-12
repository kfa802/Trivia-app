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
    <div className="card" style={{ width: '700px', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box', background: '#1e3560' }}>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
          Play a Friend's <span style={{ color: '#6c63ff' }}>Quiz</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: '500' }}>
          Enter the quiz ID your friend shared with you to start playing instantly
        </p>
      </div>

      <label style={{ fontWeight: '700', display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.8)' }}>
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
          border: '1.5px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '1rem',
          marginBottom: '12px',
          outline: 'none'
        }}
      />

      {error && <p style={{ color: '#ff6b6b', fontWeight: '600', marginBottom: '10px' }}>{error}</p>}

      <button onClick={findQuiz} disabled={loading} style={{ background: '#26890c', marginBottom: '2px' }}>
        {loading ? 'Searching...' : 'Find Quiz'}
      </button>

      <button onClick={onBack} className="btn-back">
        Back
      </button>

    </div>
  );
}

export default FindQuiz;