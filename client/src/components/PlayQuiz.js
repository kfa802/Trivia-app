import React, { useState } from 'react';

const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

function PlayQuiz({ quiz, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[currentIndex];

  const handleAnswer = (aIndex) => {
    if (selected !== null) return;
    setSelected(aIndex);
    if (aIndex === question.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (currentIndex + 1 >= quiz.questions.length) {
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    }, 900);
  };

  if (finished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="card results">
        <h2>{percentage === 100 ? 'Perfect!' : percentage >= 70 ? 'Great job!' : percentage >= 40 ? 'Not bad!' : 'Better luck next time!'}</h2>
        <p className="score-display">{score} / {quiz.questions.length}</p>
        <p className="score-percent">{percentage}%</p>
        <button onClick={onBack}>Back to quizzes</button>
      </div>
    );
  }

  return (
    <div style={{ width: '700px', maxWidth: '100%', margin: '0 auto', padding: '1rem', boxSizing: 'border-box' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          ← Back
        </button>
        <span style={{ fontWeight: '500', color: '#555' }}>Question {currentIndex + 1} / {quiz.questions.length}</span>
        <span style={{ fontWeight: '500', color: '#6c63ff' }}>Score: {score}</span>
      </div>

      <div style={{ background: 'white', border: '2px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.3rem', margin: 0 }}>{question.question}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {question.answers.map((answer, aIndex) => {
          let bg = COLORS[aIndex];
          if (selected !== null) {
            if (aIndex === question.correct) bg = '#28a745';
            else if (aIndex === selected) bg = '#dc3545';
            else bg = '#aaa';
          }
          return (
            <button key={aIndex} onClick={() => handleAnswer(aIndex)}
              style={{ background: bg, color: 'white', border: 'none', borderRadius: '10px', padding: '20px', fontSize: '1rem', cursor: selected !== null ? 'default' : 'pointer', transition: 'background 0.2s', fontWeight: '500' }}>
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlayQuiz;