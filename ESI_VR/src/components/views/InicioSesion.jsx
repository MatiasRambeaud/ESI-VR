// src/components/Login.jsx
import { useState } from 'react';
import "./css/BaseVistas.css";
import "./css/InicioSesion.css";

export default function Login() {
  const [mensaje, setMensaje] = useState('');

  const handleGoogle = () => {
    setMensaje('Simulando inicio de sesión con Google...');
  };

  const handleLogin = () => {
    setMensaje('Simulando inicio de sesión...');
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="title">
          <span className="green">E</span>
          <span className="red">S</span>
          <span className="orange">I</span>
        </h1>
        <h2>iniciar sesión</h2>

        <button className="google-button" onClick={handleGoogle}>
          Inicia con Google <span className="google-logo">G</span>
        </button>

        <button className="login-button" onClick={handleLogin}>
          iniciar sesión
        </button>

        <img src="ESI_VR\public\img\niñainicio.png" alt="Niña saludando" className="nina-img" />

        <p className="mensaje">{mensaje}</p>
      </div>

      <footer className="footer">
        <img src="ESI_VR\public\img\logo-mg.png" alt="Logo MG" className="logo" />
        <p>Desarrollado por Mafia Games</p>
        <p>Derechos copyright etc</p>
      </footer>
    </div>
  );
}