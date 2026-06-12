import React from 'react';

function Results({ score, total, onRestart, onBack }) {
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Perfect score!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 40) return 'Not bad!';
    return 'Better luck next time!';
  };

  return (
    <div className="card results">
      <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1.5rem' }}>
        {getMessage()}
      </h2>
      <p style={{
        fontSize: '4rem',
        fontWeight: '800',
        color: 'white',
        //textShadow: '0 0 15px rgba(108,99,255,0.5)',
        marginBottom: '2rem',
        lineHeight: 1
      }}>
        {score} / {total}
      </p>
      <button onClick={onRestart} style={{ background: '#6c63ff', marginBottom: '5px' }}>
        Play again
      </button>
      <button onClick={onBack} className="btn-back">
        Back to home
      </button>
    </div>
  );
}

export default Results;