import React from "react";
import "./css/BaseVistas.css";
import "./css/Error.css";

const Error = () => {
    const volverInicio = () => {
        alert("Volver al inicio");
    };

    return (
        <div className="error-contenedor">
            <button className="btn-volver" onClick={volverInicio}>
                <span>←</span> Al inicio
            </button>

            <div className="error-caja">
                <div className="error-titulo">¡ERROR!</div>
                <img
                    src="/ESI_VR/public/img/error.png"
                    alt="error"
                    className="error-imagen"
                />
                <div className="error-mensaje">
                    Ha ocurrido un <br /> error inesperado
                </div>
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

export default Error;
