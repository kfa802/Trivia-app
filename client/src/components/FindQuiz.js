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
    <div className="card">
      <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}>
        ← Back
      </button>
      <h2>Play a friend's quiz</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Ask your friend for their quiz ID and enter it below.
      </p>
      <label>
        Quiz ID
        <input
          type="text"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          placeholder="Paste quiz ID here..."
          onKeyDown={(e) => e.key === 'Enter' && findQuiz()}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button onClick={findQuiz} disabled={loading}>
        {loading ? 'Searching...' : 'Find quiz'}
      </button>
    </div>
  );
}

export default FindQuiz;