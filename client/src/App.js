import React, { useState } from 'react';
import Setup from './components/Setup';
import Question from './components/Question';
import Results from './components/Results';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'results'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startGame = async (category, difficulty) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ amount: 10 });
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);

      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError('No questions found. Try a different category or difficulty.');
        setLoading(false);
        return;
      }

      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setGameState('playing');
    } catch (err) {
      setError('Could not connect to the server. Is it running?');
    }
    setLoading(false);
  };

  const handleAnswer = (correct) => {
    if (correct) setScore((s) => s + 1);
    if (currentIndex + 1 >= questions.length) {
      setGameState('results');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setGameState('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className="app">
      <h1 className="app-title">Trivia Quiz</h1>

      {gameState === 'setup' && (
        <Setup onStart={startGame} loading={loading} error={error} />
      )}
      {gameState === 'playing' && (
        <Question
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          total={questions.length}
          score={score}
          onAnswer={handleAnswer}
        />
      )}
      {gameState === 'results' && (
        <Results score={score} total={questions.length} onRestart={restart} />
      )}
    </div>
  );
}

export default App;
