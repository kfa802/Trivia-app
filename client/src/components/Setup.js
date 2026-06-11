import React, { useState, useEffect } from 'react';

function Setup({ onStart, loading, error }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.error('Could not load categories'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(category, difficulty);
  };

  return (
    <div className="card">
      <h2>Choose your quiz</h2>
      <form onSubmit={handleSubmit}>
        <label>
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

        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Start Quiz'}
        </button>
      </form>
    </div>
  );
}

export default Setup;
