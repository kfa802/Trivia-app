# TriviaQuiz

A full-stack web application for playing and creating trivia quizzes.

## Requirements

- Node.js v18 or higher
- npm

## How to Run

### 1. Install server dependencies
cd server
npm install

### 2. Install client dependencies
cd ../client
npm install

### 3. Start the server (Terminal 1)
cd server
node index.js

Server runs on http://localhost:5000

### 4. Start the client (Terminal 2)
cd client
npm start

App opens at http://localhost:3000

## Features

- Play official trivia questions from the Open Trivia Database
- Create, edit, share and delete custom quizzes
- Share quizzes with friends using a unique ID
- User registration and login with JWT authentication
- View personal score history

## Project Structure

Trivia-app/
├── client/
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── components/
│           ├── Setup.js
│           ├── Question.js
│           ├── Results.js
│           ├── Login.js
│           ├── CreateQuiz.js
│           ├── QuizList.js
│           ├── PlayQuiz.js
│           ├── FindQuiz.js
│           └── ScoreHistory.js
└── server/
    ├── index.js
    ├── users.json
    ├── quizzes.json
    └── scores.json

## API

- Open Trivia Database (https://opentdb.com) — free, no API key required