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
    <div className="card">
      <div className="question-meta">
        <span>{quiz.title}</span>
        <span>Question {currentIndex + 1} / {quiz.questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <h2 className="question-text" style={{ marginTop: '1rem' }}>{question.question}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.5rem' }}>
        {question.answers.map((answer, aIndex) => {
          let bg = COLORS[aIndex];
          if (selected !== null) {
            if (aIndex === question.correct) bg = '#28a745';
            else if (aIndex === selected) bg = '#dc3545';
            else bg = '#aaa';
          }
          return (
            <button key={aIndex} onClick={() => handleAnswer(aIndex)}
              style={{ background: bg, color: 'white', border: 'none', borderRadius: '10px', padding: '1rem', fontSize: '1rem', cursor: selected !== null ? 'default' : 'pointer', transition: 'background 0.2s' }}>
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlayQuiz;