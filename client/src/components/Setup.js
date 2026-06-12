import React, { useState, useEffect } from 'react';

function Setup({ onStart, loading, error, onBack }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.error('Could not load categories'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryName = categories.find(c => c.id === parseInt(category))?.name || 'Any';
    onStart(category, difficulty, amount, timeLimit, categoryName);
  };

  return (
    <div className="card">

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          color: 'white'
        }}>
          Choose Your <span style={{ color: '#6c63ff' }}>Quiz</span>
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.71)',
          fontSize: '1rem',
          fontWeight: '500',
          marginTop: '0'
        }}>
          Pick category, difficulty, number of questions and generate a quiz from the Open Trivia Database
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        <label style={{ fontWeight: '700', color: 'white' }}>
          Number of questions
          <select value={amount} onChange={(e) => setAmount(e.target.value)}>
            <option value={5}>5 questions</option>
            <option value={10}>10 questions</option>
            <option value={15}>15 questions</option>
            <option value={20}>20 questions</option>
          </select>
        </label>

        <label style={{ fontWeight: '700', color: 'white' }}>
          Time per question
          <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
            <option value={10}>10 seconds</option>
            <option value={15}>15 seconds</option>
            <option value={20}>20 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
        </label>

        <label style={{ fontWeight: '700', color: 'white' }}>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontWeight: '700', color: 'white' }}>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}
          style={{ background: '#26890c' }}>
          {loading ? 'Loading...' : 'Start Quiz'}
        </button>

       <button type="button" onClick={onBack} className="btn-back">
        Back
       </button>

      </form>
    </div>
  );
}

export default Setup;