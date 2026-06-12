import React, { useState } from 'react';

const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
const LABELS = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'];

function QuestionEditor({ q, qIndex, updateQuestion, updateAnswer, updateCorrect }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #6c63ff',
      borderRadius: '12px',
      padding: '1.2rem',
      marginBottom: '10px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
    }}>

      <textarea
        value={q.question}
        onChange={(e) => updateQuestion(e.target.value)}
        placeholder="Type your question here..."
        style={{
          width: '100%',
          minHeight: '90px',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#222',
          padding: '0.9rem',
          borderRadius: '10px',
          border: '2px solid #ddd',
          marginBottom: '1rem',
          resize: 'vertical',
          outline: 'none'
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {q.answers.map((answer, aIndex) => (
          <div
            key={aIndex}
            style={{
              background: COLORS[aIndex],
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: '0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >

            <input
              type="text"
              value={answer}
              onChange={(e) => updateAnswer(aIndex, e.target.value)}
              placeholder={LABELS[aIndex]}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.5)',

                color: '#fff',
                WebkitTextFillColor: '#fff',   // 🔥 FIX THAT MAKES IT WHITE

                fontSize: '1.05rem',
                fontWeight: '600',
                padding: '6px 0',
                outline: 'none',
                letterSpacing: '0.3px'
              }}
            />

            <label style={{
              color: 'white',
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '600'
            }}>
              <input
                type="radio"
                name={`correct-${qIndex}`}
                checked={q.correct === aIndex}
                onChange={() => updateCorrect(aIndex)}
                style={{ marginRight: '6px' }}
              />
              Correct answer
            </label>

          </div>
        ))}
      </div>
    </div>
  );
}

function CreateQuiz({ onBack, existingQuiz, token }) {
  const [quizTitle, setQuizTitle] = useState(existingQuiz ? existingQuiz.title : '');
  const [questions, setQuestions] = useState(existingQuiz ? existingQuiz.questions : [
    { question: '', answers: ['', '', '', ''], correct: 0 }
  ]);
  const [timeLimit, setTimeLimit] = useState(existingQuiz ? existingQuiz.timeLimit : 15);
  const [currentQ, setCurrentQ] = useState(null);

  const updateQuestion = (value) => {
    const updated = [...questions];
    updated[currentQ].question = value;
    setQuestions(updated);
  };

  const updateAnswer = (aIndex, value) => {
    const updated = [...questions];
    updated[currentQ].answers[aIndex] = value;
    setQuestions(updated);
  };

  const updateCorrect = (aIndex) => {
    const updated = [...questions];
    updated[currentQ].correct = aIndex;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', '', '', ''], correct: 0 }]);
    setCurrentQ(questions.length);
  };

  const deleteQuestion = (i) => {
    const updated = questions.filter((_, idx) => idx !== i);
    setQuestions(updated);
    setCurrentQ(null);
  };

  const saveQuiz = async () => {
  const quiz = { title: quizTitle, questions, timeLimit: Number(timeLimit) };

  // VALIDATION
  if (!questions.length) {
    alert("You must have at least one question!");
    return;
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const filledAnswers = q.answers.filter(a => a.trim() !== '');

    if (!q.question.trim()) {
      alert(`Question ${i + 1} is empty!`);
      return;
    }

    if (filledAnswers.length < 2) {
      alert(`Question ${i + 1} must have at least 2 answers!`);
      return;
    }
  }

  if (existingQuiz) {
    await fetch(`/api/quizzes/${existingQuiz.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quiz)
    });
    alert('Quiz updated!');
  } else {
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quiz)
    });
    const data = await res.json();
    alert(`Quiz saved! ID: ${data.id}`);
  }

  onBack();
};

  return (
    <div style={{
      width: '700px',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '1.5rem',
      boxSizing: 'border-box',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    }}>

      <h1 style={{
        textAlign: 'center',
        fontSize: '3rem',
        fontWeight: '800',
        marginBottom: '0.5rem',
        color: '#6c63ff'
      }}>
        Create Quiz
      </h1>

      <p style={{
        textAlign: 'center',
        color: '#666',
        marginBottom: '20px',
        fontWeight: '500'
      }}>
        Create Your Own Quizzes and Share Them With Friends
      </p>

      <input
        type="text"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        placeholder="Quiz title..."
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '2px solid #ddd',
          fontSize: '1.3rem',
          fontWeight: '600',
          marginBottom: '15px',
          outline: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.95rem', color: '#333', fontWeight: '600' }}>
          Time per question:
        </label>

        <select
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1.5px solid #ddd',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          <option value={10}>10 seconds</option>
          <option value={15}>15 seconds</option>
          <option value={20}>20 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
        </select>
      </div>

      {questions.map((q, i) => (
        <div key={i}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: currentQ === i ? '0' : '8px' }}>

            <button
              onClick={() => setCurrentQ(currentQ === i ? null : i)}
              style={{
                flex: 1,
                background: currentQ === i ? '#6c63ff' : '#f1f1f1',
                color: currentQ === i ? 'white' : '#333',
                border: 'none',
                padding: '18px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                textAlign: 'left'
              }}
            >
              {currentQ === i ? '▼' : '▶'} Question {i + 1}
              {q.question ? ` — ${q.question.substring(0, 40)}${q.question.length > 40 ? '...' : ''}` : ''}
            </button>

            <button
              onClick={() => deleteQuestion(i)}
              style={{
                background: '#e53e3e',
                color: 'white',
                border: 'none',
                padding: '0 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '40px'
              }}
            >
              ✕
            </button>

          </div>

          {currentQ === i && (
            <QuestionEditor
              q={q}
              qIndex={i}
              updateQuestion={updateQuestion}
              updateAnswer={updateAnswer}
              updateCorrect={updateCorrect}
            />
          )}
        </div>
      ))}

      <button onClick={addQuestion} style={{
        width: '100%',
        marginTop: '10px',
        background: '#6c63ff',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        + Add question
      </button>

      <button onClick={saveQuiz} style={{
        width: '100%',
        marginTop: '10px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '700'
      }}>
        Save quiz
      </button>

      <button onClick={onBack} style={{
        width: '100%',
        marginTop: '10px',
        background: '#2c3285',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        ← Back
      </button>

    </div>
  );
}

export default CreateQuiz;