import React from "react";
import "./css/BaseVistas.css";
import "./css/TeEquivocaste.css";

const TeEquivocaste = () => {
  const volverInicio = () => {
    alert("Volver al inicio");
  };

  return (
    <div className="equivocaste-contenedor">
      <button className="btn-volver" onClick={volverInicio}>
        <span>←</span> Al inicio
      </button>

      <div className="equivocaste-caja">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src="/cara-triste.png"
            alt="cara triste"
            className="cara-fondo"
            style={{
              top: ${60 + i * 40}px,
              left: i < 3 ? "20px" : "calc(100% - 60px)",
            }}
          />
        ))}

        <div className="equivocaste-titulo">Te equivocaste</div>

        <img
          src="/te_equivocaste.png"
          alt="Personaje triste"
          className="equivocaste-imagen"
        />

        <button className="btn-explicacion">Ver explicación</button>
      </div>

      <div className="footer">
        <p>Desarrollado por Mafia Games</p>
        <p>Derechos copyright etc</p>
        <img
            src="/logo-mg.png"
            alt="Logo MG"
            className="logo-mg"
        />
      </div>
    </div>
  );
};

export default TeEquivocaste;