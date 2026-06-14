# TriviaQuiz

A full-stack web application for playing and creating trivia quizzes, built with React (frontend) and Node.js/Express (backend).

---

## Requirements

- Node.js v18 or higher
- npm

---

## How to Run

### 1. Install server dependencies

```bash
cd server
npm install
```

### 2. Install client dependencies

```bash
cd ../client
npm install
```

### 3. Start the server (Terminal 1)

```bash
cd server
node index.js
```

Server runs on **http://localhost:5000**

### 4. Start the client (Terminal 2)

```bash
cd client
npm start
```

App opens at **http://localhost:3000**

> Both terminals must be running at the same time.

---

## Features

- Play official trivia questions from the Open Trivia Database
- Choose category, difficulty, number of questions and time per question
- Create, edit, share and delete custom quizzes
- Share quizzes with friends using a unique quiz ID
- Play a friend's quiz without needing an account
- User registration and login with JWT authentication
- View personal score history

---

## Project Structure

```
Trivia-app/
├── client/
│   ├── public/
│   │   └── index.html
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
```

---

## API Used

- [Open Trivia Database](https://opentdb.com/) — free, no API key required

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Node.js + Express | Backend server |
| Open Trivia Database | Live trivia questions |
| JWT + bcryptjs | User authentication |
| JSON files | Data storage |
