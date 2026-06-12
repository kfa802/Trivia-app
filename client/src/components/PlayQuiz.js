import React, { useState, useEffect, useRef } from 'react';

const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

function PlayQuiz({ quiz, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 15);
  const timerRef = useRef(null);

  const timeLimit = quiz.timeLimit || 15;
  const question = quiz.questions[currentIndex];

  useEffect(() => {
    setTimeLeft(timeLimit);
    setSelected(null);
  }, [currentIndex, timeLimit]);

  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft === 0) {
      handleAnswer(-1);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, selected]);

  const handleAnswer = (aIndex) => {
    if (selected !== null) return;
    clearTimeout(timerRef.current);
    setSelected(aIndex);
    if (aIndex === question.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (currentIndex + 1 >= quiz.questions.length) {
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    }, 500);
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

  const timerColor = timeLeft <= 5 ? '#e53e3e' : timeLeft <= 10 ? '#e67e22' : '#28a745';
  const timerPercent = (timeLeft / timeLimit) * 100;

  return (
    <div style={{ width: '700px', maxWidth: '100%', margin: '0 auto', padding: '1rem', boxSizing: 'border-box' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          ← Back
        </button>
        <span style={{ fontWeight: '500', color: '#555' }}>Question {currentIndex + 1} / {quiz.questions.length}</span>
        <span style={{ fontWeight: '700', color: timerColor }}>{timeLeft}s</span>
        <span style={{ fontWeight: '500', color: '#6c63ff' }}>Score: {score}</span>
      </div>

      <div style={{ width: '100%', background: '#eee', borderRadius: '4px', height: '6px', margin: '8px 0 12px' }}>
        <div style={{
          width: `${timerPercent}%`,
          background: timerColor,
          height: '6px',
          borderRadius: '4px',
          transition: 'width 1s linear, background 0.3s'
        }} />
      </div>

      <div style={{ background: 'white', border: '2px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.3rem', margin: 0 }}>{question.question}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {question.answers
            .map((answer, aIndex) => ({ answer, aIndex }))
            .filter(item => item.answer && item.answer.trim() !== '')
            .map(({ answer, aIndex }) => {
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