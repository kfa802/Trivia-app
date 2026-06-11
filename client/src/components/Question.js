import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    setAnswers(buildAnswers(question));
    setSelected(null);
    setTimeLeft(timeLimit);
  }, [question, timeLimit]);

  useEffect(() => {
    if (selected) return;
    if (timeLeft === 0) {
      onAnswer(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected]);

  const handleClick = (answer) => {
    if (selected) return;
    setSelected(answer);
    setTimeout(() => {
      onAnswer(answer === question.correct_answer);
    }, 500);
  };

  const getClass = (answer) => {
    if (!selected) return 'answer-btn';
    if (answer === question.correct_answer) return 'answer-btn correct';
    if (answer === selected) return 'answer-btn wrong';
    return 'answer-btn';
  };

  const timerColor = timeLeft <= 5 ? '#e53e3e' : timeLeft <= 10 ? '#e67e22' : '#28a745';
  const timerPercent = (timeLeft / timeLimit) * 100;

  return (
    <div className="card">
      <div className="question-meta">
        <span>Question {questionNumber} / {total}</span>
        <span>Score: {score}</span>
        <span style={{ fontWeight: '700', color: timerColor }}>{timeLeft}s</span>
      </div>

      <div style={{ width: '100%', background: '#eee', borderRadius: '4px', height: '6px', margin: '8px 0 12px' }}>
        <div style={{ width: `${timerPercent}%`, background: timerColor, height: '6px', borderRadius: '4px', transition: 'width 1s linear, background 0.3s' }} />
      </div>

      <p className="category">{decode(question.category)} — {question.difficulty}</p>
      <h2 className="question-text">{decode(question.question)}</h2>
      <div className="answers">
        {answers.map((answer) => (
          <button
            key={answer}
            className={getClass(answer)}
            onClick={() => handleClick(answer)}
          >
            {decode(answer)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;