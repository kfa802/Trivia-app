import React, { useState, useEffect } from 'react';

function ScoreHistory({ onBack, token }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColor = (score, total) => {
    const pct = (score / total) * 100;
    if (pct === 100) return '#28a745';
    if (pct >= 70) return '#6c63ff';
    if (pct >= 40) return '#e67e22';
    return '#e53e3e';
  };

  return (
    <div
      style={{
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
      }}
    >

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '2.3rem',
          fontWeight: '800',
          marginBottom: '0.3rem',
          color: '#6c63ff'
        }}>
          Score History
        </h2>

        <p style={{
          color: '#666',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Track your progress across all quizzes
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>

        {loading && <p>Loading scores...</p>}

        {!loading && scores.length === 0 && (
          <p style={{ color: '#888' }}>
            No scores yet — play a quiz to get started!
          </p>
        )}

        {scores.map((s) => (
          <div
            key={s.id}
            style={{
              background: '#f9f9f9',
              border: '2px solid #e6e6e6',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >

            {/* Left side */}
            <div>
              <p style={{
                margin: 0,
                fontWeight: '700',
                color: '#1a1a2e'
              }}>
                {s.category !== 'Any' ? s.category : 'Any category'} — {s.difficulty !== 'Any' ? s.difficulty : 'Any difficulty'}
              </p>

              <p style={{
                margin: '4px 0 0',
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.6)'
              }}>
                {formatDate(s.date)}
              </p>
            </div>

            {/* Right side score */}
            <div style={{ textAlign: 'right' }}>
              <p style={{
                margin: 0,
                fontWeight: '800',
                fontSize: '1.4rem',
                color: getColor(s.score, s.total)
              }}>
                {s.score}/{s.total}
              </p>

              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#666'
              }}>
                {Math.round((s.score / s.total) * 100)}%
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* Back button */}
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

export default ScoreHistory;