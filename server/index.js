const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'trivia-secret-key-2024';

app.use(cors());
app.use(express.json());

const QUIZZES_FILE = path.join(__dirname, 'quizzes.json');
const USERS_FILE = path.join(__dirname, 'users.json');

if (!fs.existsSync(QUIZZES_FILE)) fs.writeFileSync(QUIZZES_FILE, JSON.stringify([]));
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not logged in' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already taken' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), username, password: hashed };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  const token = jwt.sign({ id: newUser.id, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username });
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: 'User not found' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Wrong password' });
  const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username });
});

// GET /api/questions
app.get('/api/questions', async (req, res) => {
  const { amount = 10, category = '', difficulty = '' } = req.query;
  try {
    const params = new URLSearchParams({ amount, type: 'multiple' });
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    const response = await axios.get(`https://opentdb.com/api.php?${params.toString()}`);
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

// POST /api/quizzes — save a quiz (requires login)
app.post('/api/quizzes', authMiddleware, (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const newQuiz = { id: uuidv4(), createdBy: req.user.username, ...req.body };
  quizzes.push(newQuiz);
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
  res.json({ id: newQuiz.id });
});

// GET /api/quizzes — get only YOUR quizzes
app.get('/api/quizzes', authMiddleware, (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const myQuizzes = quizzes.filter(q => q.createdBy === req.user.username);
  res.json(myQuizzes);
});

// GET /api/quizzes/:id — get a quiz by id (public)
app.get('/api/quizzes/:id', (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

// PUT /api/quizzes/:id — update a quiz
app.put('/api/quizzes/:id', authMiddleware, (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const index = quizzes.findIndex(q => q.id === req.params.id && q.createdBy === req.user.username);
  if (index === -1) return res.status(404).json({ error: 'Quiz not found' });
  quizzes[index] = { ...quizzes[index], ...req.body };
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
  res.json(quizzes[index]);
});

// DELETE /api/quizzes/:id
app.delete('/api/quizzes/:id', authMiddleware, (req, res) => {
  const quizzes = JSON.parse(fs.readFileSync(QUIZZES_FILE));
  const updated = quizzes.filter(q => !(q.id === req.params.id && q.createdBy === req.user.username));
  fs.writeFileSync(QUIZZES_FILE, JSON.stringify(updated, null, 2));
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});