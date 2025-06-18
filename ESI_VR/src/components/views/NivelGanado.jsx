import React from 'react';
import "./css/BaseVistas.css";
import "./css/NivelGanado.css";

const CompletionScreen = ({ onRestart, onShowExplanation }) => {
    return (
        <div className="container">
            <button className="backButton" onClick={onRestart}>⬅ Al inicio</button>

            <div className="card">
                <h1 className="title">¡FELICITACIONES!</h1>
                <p className="subtitle">Has completado el tema</p>

                {/* Personaje simple hecho en HTML y CSS */}
                <div className="character">
                    <div className="head"></div>
                    <div className="arms">
                        <div className="arm"></div>
                        <div className="arm"></div>
                    </div>
                    <div className="body"></div>
                </div>

                <button className="explanationButton" onClick={onShowExplanation}>
                    Explicación
                </button>
            </div>

            <footer className="footer">
                <div className="footerContent">
                    <strong>MG</strong> <span className="footerText">Desarrollado por Mafia Games</span>
                </div>
            </footer>
        </div>
    );
};

export default CompletionScreen;