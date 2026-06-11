const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET /api/questions?amount=10&category=9&difficulty=medium
// Proxies the Open Trivia DB API so the frontend doesn't call it directly
app.get('/api/questions', async (req, res) => {
  const { amount = 10, category = '', difficulty = '' } = req.query;

  try {
    const params = new URLSearchParams({ amount, type: 'multiple' });
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const response = await axios.get(
      `https://opentdb.com/api.php?${params.toString()}`
    );

    if (response.data.response_code !== 0) {
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/categories — fetches available trivia categories
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    res.json(response.data.trivia_categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
