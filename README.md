# Trivia Quiz App

A web-based trivia quiz built with React (frontend) and Node.js/Express (backend),
fetching questions live from the Open Trivia DB API.

## Requirements

- Node.js (v18 or higher)
- npm

## How to run

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

### 3. Start the server (in one terminal)
```bash
cd server
node index.js
```
Server runs on http://localhost:5000

### 4. Start the client (in another terminal)
```bash
cd client
npm start
```
App opens at http://localhost:3000

## Project structure

```
trivia-app/
├── client/               # React frontend
│   └── src/
│       ├── App.js        # Main app + game state
│       └── components/
│           ├── Setup.js      # Category/difficulty picker
│           ├── Question.js   # Question display + answers
│           └── Results.js    # Final score screen
└── server/
    └── index.js          # Express server + API routes
```

## API used

- [Open Trivia Database](https://opentdb.com/) — free, no API key required
