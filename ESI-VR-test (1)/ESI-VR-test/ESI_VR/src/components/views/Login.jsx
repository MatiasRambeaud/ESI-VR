import React, { useState } from 'react';
import './css/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuarios hardcodeados
    const users = [
      { username: 'admin', password: '1234' },
      { username: 'test', password: 'abcd' }
    ];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      window.location.href = '/escena.html';
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="form-button">Entrar</button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
