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

const POPUP_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

function decode(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function PopupQuiz() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelected(null);
    try {
      const res = await fetch('/api/questions?amount=1');
      const data = await res.json();
      if (data && data[0]) {
        const q = data[0];
        const all = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
        setQuestion(q);
        setAnswers(all);
        setVisible(true);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleAnswer = (answer) => {
    if (selected) return;
    setSelected(answer);
    setTimeout(() => {
      fetchQuestion();
    }, 1500);
  };

  if (!visible) {
    return (
      <button className="popup-quiz-tab" onClick={fetchQuestion} disabled={loading}>
        {loading ? 'Loading...' : 'Quick Question!'}
      </button>
    );
  }

  return (
    <div className="popup-quiz">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ color: '#a89cf7', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Question
        </span>
        <button onClick={() => setVisible(false)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', width: 'auto', padding: '2px 8px', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
          ✕
        </button>
      </div>

      <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', lineHeight: '1.4' }}>
        {decode(question.question)}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {answers.map((answer, i) => {
          let bg = POPUP_COLORS[i];
          if (selected) {
            if (answer === question.correct_answer) bg = '#28a745';
            else if (answer === selected) bg = '#dc3545';
            else bg = '#555';
          }
          return (
            <button key={answer} onClick={() => handleAnswer(answer)}
              style={{ background: bg, color: 'white', border: 'none', borderRadius: '8px', padding: '10px 8px', fontSize: '0.8rem', cursor: selected ? 'default' : 'pointer', transition: 'background 0.2s', fontWeight: '500', width: '100%' }}>
              {decode(answer)}
            </button>
          );
        })}
      </div>

      {selected && (
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: selected === question.correct_answer ? '#90ee90' : '#ffb3b3', fontWeight: '600' }}>
          {selected === question.correct_answer ? 'Correct!' : `Wrong! Answer: ${decode(question.correct_answer)}`}
        </p>
      )}

      <button onClick={fetchQuestion} style={{ marginTop: '0.75rem', background: 'rgba(108,99,255,0.3)', border: '1px solid #6c63ff', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '0.85rem', width: '100%' }}>
        Next question
      </button>
    </div>
  );
}

function Particles() {
  const orbs = [
    { width: 600, height: 600, top: '-200px', right: '-200px', left: 'auto', bottom: 'auto', color: 'rgba(108, 99, 255, 0.25)', duration: '12s', delay: '0s' },
    { width: 500, height: 500, bottom: '-150px', left: '-150px', top: 'auto', right: 'auto', color: 'rgba(74, 144, 217, 0.2)', duration: '15s', delay: '2s' },
    { width: 400, height: 400, top: '30%', left: '10%', right: 'auto', bottom: 'auto', color: 'rgba(108, 99, 255, 0.15)', duration: '18s', delay: '4s' },
    { width: 350, height: 350, top: '10%', left: '40%', right: 'auto', bottom: 'auto', color: 'rgba(74, 144, 217, 0.15)', duration: '20s', delay: '1s' },
    { width: 300, height: 300, bottom: '20%', right: '10%', top: 'auto', left: 'auto', color: 'rgba(108, 99, 255, 0.1)', duration: '14s', delay: '3s' },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: orb.width,
          height: orb.height,
          top: orb.top,
          right: orb.right,
          bottom: orb.bottom,
          left: orb.left,
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          animation: `float${(i % 3) + 1} ${orb.duration} ease-in-out ${orb.delay} infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}
    </>
  );
}

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
    setGameState('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className="app">
      <Particles />

      {gameState === 'home' && <PopupQuiz />}

      <nav className="navbar">
        <div className="navbar-title" onClick={() => setGameState('home')}>
          Trivia<span>Quiz</span>
        </div>
        {user ? (
          <div className="navbar-actions">
            <span className="navbar-user">Hi, {user}!</span>
            <button className="navbar-btn primary" onClick={() => setGameState('scores')}>
              My scores
            </button>
            <button className="navbar-btn secondary" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <div className="navbar-actions">
            <button className="navbar-btn primary" onClick={() => setShowLogin(true)}>
              Log in
            </button>
          </div>
        )}
      </nav>

      <div className="page-content">

        {gameState === 'home' && (
          <div>
            <div className="hero-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                Welcome to Trivia<span style={{ color: '#6c63ff' }}>Quiz</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
                Test your knowledge, create your own quizzes and challenge your friends
              </p>
            </div>

            <div className="card">
              <h2>What do you want to do?</h2>
              <button onClick={() => { setShowLogin(false); setGameState('setup'); }}
                style={{ marginBottom: '12px', background: '#e21b3c', letterSpacing: '0.5px' }}>
                Play Official Trivia
              </button>
              <button onClick={() => requireLogin('create')}
                style={{ marginBottom: '12px', background: '#1368ce', letterSpacing: '0.5px' }}>
                Create Your Own Quiz
              </button>
              <button onClick={() => requireLogin('quizlist')}
                style={{ marginBottom: '12px', background: '#d89e00', letterSpacing: '0.5px' }}>
                My Custom Quizzes
              </button>
              <button onClick={() => setGameState('findquiz')}
                style={{ background: '#26890c', letterSpacing: '0.5px' }}>
                Play a Friend's Quiz
              </button>
              {showLogin && !user && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
                  <Login onLogin={handleLogin} />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '1.5rem' }}>
              <div className="feature-card">
                <p style={{ color: '#6c63ff', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 6px' }}>5000+</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>Official trivia questions across 23 categories</p>
              </div>
              <div className="feature-card">
                <p style={{ color: '#4a90d9', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 6px' }}>Custom</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>Create and save your own quizzes with a timer</p>
              </div>
              <div className="feature-card">
                <p style={{ color: '#4f76c4', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 6px' }}>Share</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>Share your quiz ID and challenge your friends</p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'setup' && (
          <Setup onStart={startGame} loading={loading} error={error} onBack={() => setGameState('home')} />
        )}

        {gameState === 'create' && (
          <CreateQuiz onBack={() => setGameState('home')} token={token} />
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
            onBack={() => setGameState('home')}
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
          <Results score={score} total={questions.length} onRestart={restart} onBack={() => setGameState('home')} />
        )}

        {gameState === 'scores' && (
          <ScoreHistory
            onBack={() => setGameState('home')}
            token={token}
          />
        )}

      </div>
    </div>
  );
}

export default App;