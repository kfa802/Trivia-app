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
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getColor = (score, total) => {
    const pct = (score / total) * 100;
    if (pct === 100) return '#28a745';
    if (pct >= 70) return '#6c63ff';
    if (pct >= 40) return '#e67e22';
    return '#e53e3e';
  };

  return (
    <div style={{ width: '700px', maxWidth: '100%', margin: '0 auto', padding: '1rem', boxSizing: 'border-box' }}>
      <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' }}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '1rem' }}>My score history</h2>

      {loading && <p>Loading scores...</p>}

      {!loading && scores.length === 0 && (
        <p style={{ color: '#888' }}>No scores yet — play a quiz to get started!</p>
      )}

      {scores.map((s) => (
        <div key={s.id} style={{ background: 'white', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontWeight: '500' }}>
              {s.category !== 'Any' ? s.category : 'Any category'} — {s.difficulty !== 'Any' ? s.difficulty : 'Any difficulty'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#888' }}>{formatDate(s.date)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '1.3rem', color: getColor(s.score, s.total) }}>
              {s.score}/{s.total}
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
              {Math.round((s.score / s.total) * 100)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScoreHistory;