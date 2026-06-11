const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const QUIZZES_FILE = path.join(__dirname, 'quizzes.json');
if (!fs.existsSync(QUIZZES_FILE)) {
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify([]));
}

// GET /api/questions
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
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/categories
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    res.json(response.data.trivia_categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/quizzes — save a quiz
app.post('/api/quizzes', (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const newQuiz = { id: uuidv4(), ...req.body };
  quizzes.push(newQuiz);
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
  res.json({ id: newQuiz.id });
});

// GET /api/quizzes — get all quizzes
app.get('/api/quizzes', (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  res.json(quizzes);
});

// GET /api/quizzes/:id — get a quiz by id
app.get('/api/quizzes/:id', (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});