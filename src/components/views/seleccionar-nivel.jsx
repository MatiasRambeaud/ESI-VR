import React from 'react';
import './css/seleccionar-nivel.css';

export default function SeleccionarNivel() {
  return (
    <div className="mobile-container">
      <header className="header">
        <span className="emoji">😊</span>
        <h1 className="title">
          <span className="letra letra-e">E</span>
          <span className="letra letra-s">S</span>
          <span className="letra letra-i">I</span>
        </h1>
        <span className="emoji">😊</span>
      </header>

      <main className="main-content">
        <button className="btn">Ir al perfil</button>
        <button className="btn green">Seleccionar nivel</button>
        <img src="/seleccionar_nivel.png" alt="niño" className="avatar" />
      </main>

      <footer className="footer">
        <p>Desarrollado por Mafia Games</p>
        <p>© Todos los derechos reservados</p>
      </footer>
    </div>
  );
}


function VistaPerfil({ setView }) {
  return (
    <div className="contenedor-simulado">
      <h2>Vista Perfil</h2>
      <button className="boton" onClick={() => setView("home")}>Volver</button>
    </div>
  );
}

function VistaNiveles({ setView }) {
  return (
    <div className="contenedor-simulado">
      <h2>Vista Niveles</h2>
      <button className="boton" onClick={() => setView("home")}>Volver</button>
    </div>
  );
}
