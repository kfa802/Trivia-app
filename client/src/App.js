import React, { useState, useEffect } from 'react';
import Setup from './components/Setup';
import Question from './components/Question';
import Results from './components/Results';
import CreateQuiz from './components/CreateQuiz';
import QuizList from './components/QuizList';
import PlayQuiz from './components/PlayQuiz';
import Login from './components/Login';
import ScoreHistory from './components/ScoreHistory';
import FindQuiz from './components/FindQuiz';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('home');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [timeLimit, setTimeLimit] = useState(15);
  const [lastGameInfo, setLastGameInfo] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUser(savedUsername);
    }
  }, []);

  const handleLogin = (username, tok) => {
    setUser(username);
    setToken(tok);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setToken(null);
    setGameState('home');
    setShowLogin(false);
  };

  const requireLogin = (destination) => {
    if (user) {
      setGameState(destination);
    } else {
      setShowLogin(true);
    }
  };

  const startGame = async (category, difficulty, amount, limit, categoryName) => {
    setLoading(true);
    setError('');
    setTimeLimit(limit);
    setLastGameInfo({ category: categoryName, difficulty: difficulty || 'Any', total: amount });
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

  const saveScore = async (finalScore) => {
    if (!user || !token) return;
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        score: finalScore,
        total: questions.length,
        category: lastGameInfo?.category || 'Any',
        difficulty: lastGameInfo?.difficulty || 'Any',
      })
    });
  };

  const handleAnswer = (correct) => {
    const newScore = correct ? score + 1 : score;
    if (correct) setScore((s) => s + 1);
    if (currentIndex + 1 >= questions.length) {
      saveScore(newScore);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 className="app-title" style={{ margin: '1rem 0' }}>Trivia Quiz</h1>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>Hi, {user}!</span>
            <button onClick={() => setGameState('scores')} style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              My scores
            </button>
            <button onClick={handleLogout} style={{ background: '#888', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Log out
            </button>
          </div>
        )}
      </div>

      {gameState === 'home' && (
        <div className="card">
          <h2>What do you want to do?</h2>
          <button onClick={() => { setShowLogin(false); setGameState('setup'); }}>
            Play official trivia
          </button>
          <button onClick={() => setGameState('findquiz')}
            style={{ marginTop: '10px', background: '#1368ce' }}>
            Play a friend's quiz
          </button>
          <button onClick={() => requireLogin('create')}
            style={{ marginTop: '10px', background: '#28a745' }}>
            Create your own quiz
          </button>
          <button onClick={() => requireLogin('quizlist')}
            style={{ marginTop: '10px', background: '#e67e22' }}>
            My custom quizzes
          </button>
          {showLogin && !user && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <Login onLogin={handleLogin} />
            </div>
          )}
        </div>
      )}

      {gameState === 'setup' && (
        <Setup onStart={startGame} loading={loading} error={error} onBack={() => setGameState('home')} />
      )}

      {gameState === 'create' && (
        <CreateQuiz onBack={() => setGameState('quizlist')} token={token} />
      )}

      {gameState === 'findquiz' && (
        <FindQuiz
          onBack={() => setGameState('home')}
          onFound={(quiz) => { setSelectedQuiz(quiz); setGameState('playquiz'); }}
        />
      )}

      {gameState === 'quizlist' && (
        <QuizList
          onBack={() => setGameState('home')}
          onSelect={(quiz) => { setSelectedQuiz(quiz); setGameState('playquiz'); }}
          onEdit={(quiz) => { setSelectedQuiz(quiz); setGameState('editquiz'); }}
          token={token}
        />
      )}

      {gameState === 'editquiz' && (
        <CreateQuiz
          onBack={() => setGameState('quizlist')}
          existingQuiz={selectedQuiz}
          token={token}
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
          timeLimit={Number(timeLimit)}
        />
      )}

      {gameState === 'results' && (
        <Results score={score} total={questions.length} onRestart={restart} />
      )}

      {gameState === 'scores' && (
        <ScoreHistory
          onBack={() => setGameState('home')}
          token={token}
        />
      )}
    </div>
  );
}

export default App;