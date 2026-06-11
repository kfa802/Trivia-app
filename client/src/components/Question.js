import React, { useState, useEffect } from 'react';

// Shuffles the correct answer in among the wrong answers
function buildAnswers(question) {
  const all = [...question.incorrect_answers, question.correct_answer];
  return all.sort(() => Math.random() - 0.5);
}

// The API HTML-encodes special characters — this decodes them
function decode(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function Question({ question, questionNumber, total, score, onAnswer }) {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setAnswers(buildAnswers(question));
    setSelected(null);
  }, [question]);

  const handleClick = (answer) => {
    if (selected) return; // already answered
    setSelected(answer);
    setTimeout(() => {
      onAnswer(answer === question.correct_answer);
    }, 900);
  };

  const getClass = (answer) => {
    if (!selected) return 'answer-btn';
    if (answer === question.correct_answer) return 'answer-btn correct';
    if (answer === selected) return 'answer-btn wrong';
    return 'answer-btn';
  };

  return (
    <div className="card">
      <div className="question-meta">
        <span>Question {questionNumber} / {total}</span>
        <span>Score: {score}</span>
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
