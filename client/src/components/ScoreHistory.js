import React, { useState, useEffect } from 'react';

function ScoreHistory({ onBack, token }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => { setScores(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
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
    <div className="card" style={{ width: '700px', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box', background: '#1e3560' }}>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
          Score <span style={{ color: '#6c63ff' }}>History</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: '500' }}>
          Track your progress across all quizzes
        </p>
      </div>

      {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading scores...</p>}

      {!loading && scores.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>No scores yet — play a quiz to get started!</p>
      )}

      {scores.map((s) => (
        <div key={s.id}
          style={{ background: 'rgba(108,99,255,0.2)', border: '1.5px solid #6c63ff', borderRadius: '10px', padding: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontWeight: '700', color: 'white' }}>
              {s.category !== 'Any' ? s.category : 'Any category'} — {s.difficulty !== 'Any' ? s.difficulty : 'Any difficulty'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              {formatDate(s.date)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '1.4rem', color: getColor(s.score, s.total) }}>
              {s.score}/{s.total}
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              {Math.round((s.score / s.total) * 100)}%
            </p>
          </div>
        </div>
      ))}

      <button onClick={onBack} className="btn-back" style={{ marginTop: '10px' }}>
        Back
      </button>
    </div>
  );
}

export default ScoreHistory;