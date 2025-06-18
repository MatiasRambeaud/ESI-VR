import React from "react";
import "./css/vistaexplicacion.css";

const VistaExplicacion = () => {
  return (
    <div className="mobile-container">
      <button className="btn-volver">← Al inicio</button>

      <div className="contenedor">
        <div className="cuadro-explicacion">
          <p className="texto-explicacion">$Explicacion</p>
        </div>

        <div className="personajes">
          <img src="/nene-triste.png" alt="Niño triste" className="avatar" />
          <button className="btn green">Continuar</button>
          <img src="/nena-triste.png" alt="Niña pensativa" className="avatar" />
        </div>
      </div>

      <footer className="logo">
        <img  src="/logo-mg.png" alt="Logo MG" className="logo-mg" />
        <p>Desarrollado por Mafia Games</p>
      </footer>
    </div>
  );
};

export default VistaExplicacion;
