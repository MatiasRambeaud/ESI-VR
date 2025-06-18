import React from "react";
import "./css/seleccionar-nivel.css";

export default function SeleccionarNivel() {
  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <span className="emoji">😊</span>
          <h1 className="title">
            <span className="letra e">E</span>
            <span className="letra s">S</span>
            <span className="letra i">I</span>
          </h1>
          <span className="emoji">😊</span>
        </div>

        <button className="btn">Ir al perfil</button>
        <button className="btn green">Seleccionar nivel</button>
        <img src="/seleccionar_nivel.png" alt="niño" className="avatar" />
      </div>

      <footer>
        <div className="footer-container">
          <img src="/logo-mg.png" alt="MG logo" className="logo" />
          <div>
            <p>Desarrollado por Mafia Games</p>
            <p>Derechos copyright etc</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
