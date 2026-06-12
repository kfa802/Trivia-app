import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        onLogin(data.username, data.token);
      }
    } catch {
      setError('Could not connect to server');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>{isRegister ? 'Create account' : 'Log in'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </label>
        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}
          style={{ background: '#6c63ff' }}>
          {loading ? 'Loading...' : isRegister ? 'Create account' : 'Log in'}
        </button>

        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          style={{ marginTop: '10px', background: '#26890c' }}
        >
          {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
}

export default Login;