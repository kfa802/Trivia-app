import React, { useState } from 'react';

const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
const LABELS = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'];

function QuestionEditor({ q, qIndex, updateQuestion, updateAnswer, updateCorrect }) {
  return (
    <div className="accordion" style={{ background: '#f9f9f9', border: '2px solid #6c63ff', borderRadius: '0 0 8px 8px', padding: '1rem', marginBottom: '8px' }}>
      <textarea
        value={q.question}
        onChange={(e) => updateQuestion(e.target.value)}
        placeholder="Type your question here..."
        style={{ width: '100%', minHeight: '80px', fontSize: '1.1rem', padding: '0.75rem', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '1rem', resize: 'vertical', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {q.answers.map((answer, aIndex) => (
          <div key={aIndex} style={{ background: COLORS[aIndex], borderRadius: '10px', padding: '10px' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => updateAnswer(aIndex, e.target.value)}
              placeholder={LABELS[aIndex]}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.5)', color: 'white', fontSize: '1rem', padding: '4px 0', outline: 'none', boxSizing: 'border-box' }}
            />
            <label style={{ color: 'white', fontSize: '0.85rem', cursor: 'pointer', marginTop: '6px', display: 'block' }}>
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
    const quiz = { title: quizTitle, questions };
    if (existingQuiz) {
      await fetch(`/api/quizzes/${existingQuiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(quiz)
      });
      alert('Quiz updated!');
    } else {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(quiz)
      });
      const data = await res.json();
      alert(`Quiz saved! ID: ${data.id}`);
    }
    onBack();
  };

  return (
    <div style={{ width: '700px', maxWidth: '100%', margin: '0 auto', padding: '1rem', boxSizing: 'border-box' }}>

      <button onClick={onBack} style={{ background: '#888', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' }}>
        ← Back
      </button>

      <input
        type="text"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        placeholder="Quiz title..."
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '1.2rem', boxSizing: 'border-box', display: 'block', marginBottom: '1rem' }}
      />

      {questions.map((q, i) => (
        <div key={i}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: currentQ === i ? '0' : '8px' }}>
            <button
              onClick={() => setCurrentQ(currentQ === i ? null : i)}
              style={{
                flex: 1,
                background: currentQ === i ? '#6c63ff' : '#ddd',
                color: currentQ === i ? 'white' : '#333',
                border: 'none',
                padding: '20px',
                borderRadius: currentQ === i ? '8px 8px 0 0' : '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1rem',
                textAlign: 'left',
              }}
            >
              {currentQ === i ? '▼' : '▶'} Question {i + 1}
              {q.question ? ` — ${q.question.substring(0, 40)}${q.question.length > 40 ? '...' : ''}` : ''}
            </button>
            <button
              onClick={() => deleteQuestion(i)}
              style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '0 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0, width: '40px' }}
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

      <button onClick={addQuestion}
        style={{ width: '100%', background: '#6c63ff', color: 'white', border: 'none', padding: '20px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: '8px' }}>
        + Add question
      </button>

      <button onClick={saveQuiz}
        style={{ width: '100%', marginTop: '10px', background: '#28a745', color: 'white', border: 'none', padding: '20px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>
        Save quiz
      </button>

    </div>
  );
}

export default CreateQuiz;