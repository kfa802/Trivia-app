import React from 'react';

function Results({ score, total, onRestart }) {
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Perfect score!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 40) return 'Not bad!';
    return 'Better luck next time!';
  };

  return (
    <div className="card results">
      <h2>{getMessage()}</h2>
      <p className="score-display">
        {score} / {total}
      </p>
      <p className="score-percent">{percentage}%</p>
      <button onClick={onRestart}>Play again</button>
    </div>
  );
}

export default Results;
