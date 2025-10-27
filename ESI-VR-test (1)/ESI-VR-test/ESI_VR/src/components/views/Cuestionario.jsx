import React, { useState } from "react";
import questionsData from "../../data/questions.json";
import "./css/BaseVistas.css";
import "./css/Cuestionario.css";

const Cuestionario = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const question = questionsData[currentQuestion];

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      alert("¡Cuestionario completado!");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="contenedor-cuestionario">
      <div className="cuestionario-header">
        <h2 className="titulo-cuestionario">Cuestionario ESI</h2>
        <div className="progress-info">
          Pregunta {currentQuestion + 1} de {questionsData.length}
        </div>
      </div>

      <div className="pregunta-container">
        <div className="pregunta-box">
          <h3 className="pregunta-texto">{question.question}</h3>
          
          <div className="opciones-container">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`opcion-btn ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cuestionario-navigation">
        <button 
          className="btn-nav" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Anterior
        </button>
        
        <button 
          className="btn-nav btn-primary" 
          onClick={handleNext}
          disabled={selectedAnswer === null}
        >
          {currentQuestion === questionsData.length - 1 ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>

      <div className="footer">
        <p>Desarrollado por Mafia Games</p>
        <p>Derechos copyright etc</p>
        <img src="/logo-mg.png" alt="Logo MG" className="logo-mg"/>
      </div>
    </div>
  );
};

export default Cuestionario;

