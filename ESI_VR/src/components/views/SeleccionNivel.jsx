import React, { useState } from "react";
import "./css/BaseVistas.css";
import "./css/SeleccionNivel.css";


const SeleccionNivel = () => {
  const volverInicio = () => {
        alert("Volver al inicio");
    };

    const seleccionNivel1 = () => {
        alert("Seleccion del primer nivel");
    };

    const seleccionNivel2 = () => {
        alert("Seleccion del segundo nivel");
    };

    const seleccionNivel3 = () => {
        alert("Seleccion del tercer nivel");
    };

  return (
    <div className="contenedor">
      <button className="btn-volver" onClick={volverInicio}>⬅ Al inicio</button>

      <div className="caja-principal">
        <h2 className="titulo">Seleccione un nivel</h2>

        <div className="nubes">
          <button className="nube-btn" onClick={seleccionNivel1}>Inicial</button>
          <button className="nube-btn" onClick={seleccionNivel2}>Primario</button>
          <button className="nube-btn" onClick={seleccionNivel3}>Secundario</button>
        </div>

        <img src="/niño-pensando.png" alt="Chico pensando" className="niño" />
      </div>

        <div className="footer">
                <p>Desarrollado por Mafia Games</p>
                <p>Derechos copyright etc</p>
                <img src="/logo-mg.png" alt="Logo MG" className="logo-mg"/>
            </div>
    </div>
  );
};

export default SeleccionNivel;
