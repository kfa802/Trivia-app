import React, { useState, useEffect, useRef } from 'react';

const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

function buildAnswers(question) {
  const all = [...question.incorrect_answers, question.correct_answer];
  return all.sort(() => Math.random() - 0.5);
}

function decode(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function Question({ question, questionNumber, total, score, onAnswer, timeLimit = 15 }) {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [transitioning, setTransitioning] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    setTransitioning(false);
    setAnswers(buildAnswers(question));
    setSelected(null);
    setTimeLeft(timeLimit);
    setTimeout(() => setTransitioning(true), 50);
  }, [question, timeLimit]);

  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft === 0) {
      onAnswer(false);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, selected]);

  const handleClick = (answer) => {
    if (selected !== null) return;
    clearTimeout(timerRef.current);
    setSelected(answer);
    setTimeout(() => {
      onAnswer(answer === question.correct_answer);
    }, 500);
  };

  const timerColor = timeLeft <= 5 ? '#e53e3e' : timeLeft <= 10 ? '#e67e22' : '#28a745';
  const timerPercent = (timeLeft / timeLimit) * 100;

  return (
    <div className="card">
      <p style={{ fontSize: '0.8rem', color: '#3a3090', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: '600' }}>
        {decode(question.category)} — {question.difficulty}
      </p>

      <div className="question-meta">
        <span>Question {questionNumber} / {total}</span>
        <span>Score: {score}</span>
        <span style={{ fontWeight: '700', color: timerColor }}>{timeLeft}s</span>
      </div>

      <div style={{ width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: '4px', height: '6px', margin: '8px 0 12px' }}>
        <div style={{
          width: `${timerPercent}%`,
          background: timerColor,
          height: '6px',
          borderRadius: '4px',
          transition: transitioning ? 'width 1s linear, background 0.3s' : 'none'
        }} />
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.43)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.3rem', margin: 0, color: '#0d1b2a' }}>{decode(question.question)}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {answers.map((answer, aIndex) => {
          let bg = COLORS[aIndex];
          if (selected !== null) {
            if (answer === question.correct_answer) bg = '#28a745';
            else if (answer === selected) bg = '#dc3545';
            else bg = '#aaa';
          }
          return (
            <button
              key={answer}
              onClick={() => handleClick(answer)}
              style={{
                background: bg,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '20px',
                fontSize: '1rem',
                cursor: selected !== null ? 'default' : 'pointer',
                transition: 'background 0.2s',
                fontWeight: '500',
                textAlign: 'center'
              }}
            >
              {decode(answer)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Question;