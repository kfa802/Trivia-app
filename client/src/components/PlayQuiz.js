import React, { useState, useEffect, useRef } from 'react';

const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

function playTick(timeLeft, timeLimit) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    const urgency = 1 - (timeLeft / timeLimit);
    oscillator.frequency.value = 600 + (urgency * 800);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.05 + (urgency * 0.2), ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

function PlayQuiz({ quiz, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 15);
  const [transitioning, setTransitioning] = useState(true);
  const timerRef = useRef(null);

  const timeLimit = quiz.timeLimit || 15;
  const question = quiz.questions[currentIndex];

  useEffect(() => {
    setTransitioning(false);
    setSelected(null);
    setTimeLeft(timeLimit);
    setTimeout(() => setTransitioning(true), 50);
  }, [currentIndex, timeLimit]);

  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft === 0) {
      handleAnswer(-1);
      return;
    }
    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      playTick(timeLeft, timeLimit);
     
    }, 1000);
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
        textShadow: '0 0 15px rgba(108,99,255,0.5)',
        marginBottom: '2rem',
        lineHeight: 1
      }}>
        {score} / {quiz.questions.length}
      </p>
      <button onClick={onBack} className="btn-back" style={{ marginTop: '5px' }}>
        Back to quizzes
      </button>
    </div>
  );
}

  const timerColor = timeLeft <= 5 ? '#e53e3e' : timeLeft <= 10 ? '#e67e22' : '#28a745';
  const timerPercent = (timeLeft / timeLimit) * 100;

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: '600' }}>
        {quiz.title}
      </p>

      <div className="question-meta">
        <span>Question {currentIndex + 1} / {quiz.questions.length}</span>
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

      <div style={{ background: 'rgb(255, 255, 255)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.3rem', margin: 0, color: '#0d1b2a' }}>{question.question}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {question.answers.filter(a => a.trim() !== '').map((answer, aIndex) => {
          let bg = COLORS[aIndex];
          if (selected !== null) {
            if (aIndex === question.correct) bg = '#28a745';
            else if (aIndex === selected) bg = '#dc3545';
            else bg = '#aaa';
          }
          return (
            <button key={aIndex} onClick={() => handleAnswer(aIndex)}
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
              }}>
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlayQuiz;