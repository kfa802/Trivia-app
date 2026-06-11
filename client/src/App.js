import React, { useState } from 'react';
import Setup from './components/Setup';
import Question from './components/Question';
import Results from './components/Results';
import CreateQuiz from './components/CreateQuiz';
import QuizList from './components/QuizList';
import PlayQuiz from './components/PlayQuiz';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('home');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const startGame = async (category, difficulty, amount) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ amount });
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
    setGameState('home');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className="app">
      <h1 className="app-title">Trivia Quiz</h1>

      {gameState === 'home' && (
        <div className="card">
          <h2>What do you want to do?</h2>
          <button onClick={() => setGameState('setup')}>
            Play official trivia
          </button>
          <button onClick={() => setGameState('create')}
            style={{ marginTop: '10px', background: '#28a745' }}>
            Create your own quiz
          </button>
          <button onClick={() => setGameState('quizlist')}
            style={{ marginTop: '10px', background: '#e67e22' }}>
            Play a custom quiz
          </button>
        </div>
      )}

      {gameState === 'setup' && (
        <Setup onStart={startGame} loading={loading} error={error} />
      )}

      {gameState === 'create' && (
        <CreateQuiz onBack={() => setGameState('quizlist')} />
      )}

      {gameState === 'quizlist' && (
        <QuizList
          onBack={() => setGameState('home')}
          onSelect={(quiz) => { setSelectedQuiz(quiz); setGameState('playquiz'); }}
          onEdit={(quiz) => { setSelectedQuiz(quiz); setGameState('editquiz'); }}
        />
      )}

      {gameState === 'playquiz' && (
        <PlayQuiz
          quiz={selectedQuiz}
          onBack={() => setGameState('quizlist')}
        />
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

      {gameState === 'editquiz' && (
        <CreateQuiz
          onBack={() => setGameState('quizlist')}
          existingQuiz={selectedQuiz}
        />
      )}
    </div>
  );
}

export default App;