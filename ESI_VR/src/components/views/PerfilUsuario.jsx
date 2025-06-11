import React, { useState } from "react";
import "./css/BaseVistas.css";
import "./css/PerfilUsuario.css";

const PerfilUsuario = () => {
  const [perfil, setPerfil] = useState({
    nombre: "Rambeaud",
    apellido: "Matias",
    educacion: "Secundario",
    foto: "/foto-perfil.png",
  });

  const [editando, setEditando] = useState(false);
  const [datosTemporales, setDatosTemporales] = useState(perfil);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosTemporales((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = () => {
    setPerfil(datosTemporales);
    setEditando(false);
  };

  const cancelarEdicion = () => {
    setDatosTemporales(perfil);
    setEditando(false);
  };

  const cerrarSesion = () => {
    alert("Sesión cerrada");
  };

  const volverInicio = () => {
    alert("Volver al inicio");
  };

  return (
    <div className="perfil-contenedor">
      <button className="btn-volver" onClick={volverInicio}>
        <span>←</span> Al inicio
      </button>

      <div className="perfil-encabezado">
        Perfil de {perfil.nombre}
      </div>

      <div className="perfil-cuerpo">
        <div className="foto-marco">
          <img src={perfil.foto} alt="Foto de perfil" className="perfil-foto" />
        </div>

        {editando ? (
          <>
            <div className="campo">
              <strong>Nombre:</strong>
              <input type="text" name="nombre" value={datosTemporales.nombre} onChange={manejarCambio} className="input" />
            </div>
            <div className="campo">
              <strong>Apellido:</strong>
              <input type="text" name="apellido" value={datosTemporales.apellido} onChange={manejarCambio} className="input" />
            </div>
            <div className="campo">
              <strong>Nivel educativo:</strong>
              <input type="text" name="educacion" value={datosTemporales.educacion} onChange={manejarCambio} className="input" />
            </div>
            <div className="botones-edicion">
              <button onClick={guardarCambios} className="btn-guardar">Guardar</button>
              <button onClick={cancelarEdicion} className="btn-cancelar">Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <div className="campo">
              <strong>Nombre:</strong> {perfil.nombre}
            </div>
            <div className="campo">
              <strong>Apellido:</strong> {perfil.apellido}
            </div>
            <div className="campo">
              <strong>Nivel educativo:</strong> {perfil.educacion}
            </div>
            <button onClick={() => setEditando(true)} className="btn-editar">Editar</button>
          </>
        )}

        <button onClick={cerrarSesion} className="btn-cerrar">
          Cerrar sesión
        </button>
      </div>

      <div className="footer">
        <p>Desarrollado por Mafia Games</p>
        <p>Derechos copyright etc</p>
        <img src="/logo-mg.png" alt="Logo MG" className="logo-mg" />
      </div>
    </div>
  );
};

export default PerfilUsuario;
