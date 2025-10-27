import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VRPlaza } from './VRPlaza';
import questionsData from '../../data/questions.json';
import { useAuth } from '../../context/AuthContext';
import { usePuntajes } from '../../hooks/usePuntajes';

const pickRandomIndices = (total, count) => {
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, Math.min(count, total));
};

const VRLevels = ({ onFinish }) => {
  const { user } = useAuth();
  const { guardarPuntaje, isLoading: isSaving, error: saveError } = usePuntajes();
  
  // Estados para manejar el quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice de la pregunta actual
  const [score, setScore] = useState(0); // Puntaje total (respuestas correctas)
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Array de respuestas seleccionadas
  const [isAnswered, setIsAnswered] = useState(false); // Si la pregunta actual ya fue respondida
  const [showFeedback, setShowFeedback] = useState(false); // Mostrar feedback correcto/incorrecto
  const [isCorrect, setIsCorrect] = useState(false); // Si la respuesta es correcta
  const [showScoreScreen, setShowScoreScreen] = useState(false); // Mostrar pantalla de puntaje final
  
  const [quizData, setQuizData] = useState({
    questionIndices: [],
    questions: []
  });

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);

  const maxRounds = 5;

  const allQuestions = useMemo(() => {
    // Validate format; fallback to empty array if invalid
    if (!Array.isArray(questionsData)) return [];
    return questionsData.filter(q => q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length === 3 && typeof q.answerIndex === 'number');
  }, []);

  // Obtener pregunta actual
  const currentQuestion = useMemo(() => {
    if (quizData.questions.length === 0 || currentQuestionIndex >= quizData.questions.length) {
      return null;
    }
    return quizData.questions[currentQuestionIndex];
  }, [quizData.questions, currentQuestionIndex]);

  // Inicializar el quiz con preguntas aleatorias
  useEffect(() => {
    if (allQuestions.length > 0) {
      const randomIndices = pickRandomIndices(allQuestions.length, maxRounds);
      const selectedQuestions = randomIndices.map(idx => allQuestions[idx]);
      
      setQuizData({
        questionIndices: randomIndices,
        questions: selectedQuestions
      });
      
      // Resetear estados
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswers([]);
      setIsAnswered(false);
      setShowFeedback(false);
      setShowScoreScreen(false);
    }
  }, [allQuestions.length]);

  // Función para verificar respuesta y verificar si es correcta
  const verificarRespuesta = (selectedAnswerIndex) => {
    if (!currentQuestion || isAnswered) return;
    
    const respuestaCorrecta = selectedAnswerIndex === currentQuestion.answerIndex;
    
    // Guardar la respuesta en el array
    const nuevaRespuesta = {
      questionIndex: quizData.questionIndices[currentQuestionIndex],
      selectedIndex: selectedAnswerIndex,
      correctIndex: currentQuestion.answerIndex,
      isCorrect: respuestaCorrecta
    };
    
    setSelectedAnswers(prev => [...prev, nuevaRespuesta]);
    
    // Actualizar estados
    setIsCorrect(respuestaCorrecta);
    setIsAnswered(true);
    setShowFeedback(true);
    
    // Si la respuesta es correcta, sumar un punto
    if (respuestaCorrecta) {
      setScore(prev => prev + 1);
    }
  };

  // Función para avanzar a la siguiente pregunta
  const avanzarSiguientePregunta = () => {
    const siguienteIndice = currentQuestionIndex + 1;
    
    if (siguienteIndice >= maxRounds) {
      // Quiz completado - mostrar puntaje y guardar
      setShowScoreScreen(true);
      
      // Guardar puntaje en Firestore
      if (user) {
        // El score ya incluye todas las respuestas correctas incluyendo la última
        const scoreData = {
          score: score,
          totalQuestions: maxRounds,
          questionIndices: quizData.questionIndices
        };
        guardarPuntaje(scoreData);
      }
    } else {
      // Avanzar a la siguiente pregunta
      setCurrentQuestionIndex(siguienteIndice);
      setIsAnswered(false);
      setShowFeedback(false);
    }
  };

  // Event listeners para los botones de respuesta
  useEffect(() => {
    const handleOptionClick = (optionIndex) => {
      if (!currentQuestion || isAnswered) return;
      
      verificarRespuesta(optionIndex);
    };

    const h1 = () => handleOptionClick(0);
    const h2 = () => handleOptionClick(1);
    const h3 = () => handleOptionClick(2);

    if (box1Ref.current) box1Ref.current.addEventListener('click', h1);
    if (box2Ref.current) box2Ref.current.addEventListener('click', h2);
    if (box3Ref.current) box3Ref.current.addEventListener('click', h3);

    return () => {
      if (box1Ref.current) box1Ref.current.removeEventListener('click', h1);
      if (box2Ref.current) box2Ref.current.removeEventListener('click', h2);
      if (box3Ref.current) box3Ref.current.removeEventListener('click', h3);
    };
  }, [currentQuestion, isAnswered, currentQuestionIndex, quizData.questionIndices]);

  // Auto-avanzar a la siguiente pregunta después de mostrar feedback
  useEffect(() => {
    if (showFeedback && isAnswered) {
      const timer = setTimeout(() => {
        avanzarSiguientePregunta();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showFeedback, isAnswered]);

  const titleBg = isCorrect ? '#4CAF50' : '#f0f0f0';

  // Pantalla de puntaje final
  if (showScoreScreen) {
    const handleBackToStart = () => {
      if (onFinish) onFinish();
    };

    const scoreScreen = (
      <a-entity position="0 0 0.01">
        <a-plane color="#f0f0f0" width="1.8" height="1.5" position="0 0 -0.01" opacity="0.9"></a-plane>

        <a-plane color="#4CAF50" width="1.6" height="0.4" position="0 0.55 0"></a-plane>
        <a-text value="¡Quiz Completado!" position="0 0.55 0.01" color="#fff" align="center" width="1.5"></a-text>

        <a-text value={`Puntaje: ${score} / ${maxRounds}`} position="0 0.1 0" color="#333" align="center" width="1.6"></a-text>
        
        <a-text 
          value={
            isSaving ? "Guardando puntaje..." : 
            saveError ? `Error: ${saveError}` : 
            "Puntaje guardado exitosamente"
          } 
          position="0 -0.1 0" 
          color={
            isSaving ? "#FF9800" : 
            saveError ? "#F44336" : 
            "#4CAF50"
          } 
          align="center" 
          width="1.6"
        ></a-text>

        <a-box 
          ref={box1Ref}
          position="0 -0.4 0" 
          width="1.0" 
          height="0.2" 
          depth="0.05" 
          color="#2196F3" 
          class="clickable"
        >
          <a-text value="Volver al Inicio" position="0 0 0.026" color="#fff" align="center" width="1.0"></a-text>
        </a-box>
      </a-entity>
    );

    // Agregar event listener para el botón de volver
    useEffect(() => {
      if (box1Ref.current) {
        box1Ref.current.addEventListener('click', handleBackToStart);
      }
      return () => {
        if (box1Ref.current) {
          box1Ref.current.removeEventListener('click', handleBackToStart);
        }
      };
    }, []);

    return (
      <VRPlaza
        onBack={onFinish}
        onProfile={() => {}}
        onSelectLevel={() => {}}
      >
        {scoreScreen}
      </VRPlaza>
    );
  }

  const screen = (
    <a-entity position="0 0 0.01">
      <a-plane color="#f0f0f0" width="1.8" height="1.5" position="0 0 -0.01" opacity="0.9"></a-plane>

      {/* Título de la pregunta con color según feedback */}
      <a-plane color={showFeedback ? (isCorrect ? '#4CAF50' : '#F44336') : titleBg} width="1.6" height="0.4" position="0 0.55 0"></a-plane>
      <a-text 
        value={currentQuestion ? currentQuestion.question : 'Cargando...'} 
        position="0 0.55 0.01" 
        color="#222" 
        align="center" 
        width="1.5"
      ></a-text>

      {/* Opción 1 */}
      <a-box 
        ref={box1Ref} 
        position="0 0.1 0" 
        width="1.4" 
        height="0.22" 
        depth="0.05" 
        color={showFeedback && isAnswered ? "#fff" : "#ffffff"} 
        class="clickable"
      >
        <a-text value={currentQuestion ? currentQuestion.options[0] : ''} position="0 0 0.026" color="#000" align="center" width="1.3"></a-text>
      </a-box>

      {/* Opción 2 */}
      <a-box 
        ref={box2Ref} 
        position="0 -0.2 0" 
        width="1.4" 
        height="0.22" 
        depth="0.05" 
        color={showFeedback && isAnswered ? "#fff" : "#ffffff"} 
        class="clickable"
      >
        <a-text value={currentQuestion ? currentQuestion.options[1] : ''} position="0 0 0.026" color="#000" align="center" width="1.3"></a-text>
      </a-box>

      {/* Opción 3 */}
      <a-box 
        ref={box3Ref} 
        position="0 -0.5 0" 
        width="1.4" 
        height="0.22" 
        depth="0.05" 
        color={showFeedback && isAnswered ? "#fff" : "#ffffff"} 
        class="clickable"
      >
        <a-text value={currentQuestion ? currentQuestion.options[2] : ''} position="0 0 0.026" color="#000" align="center" width="1.3"></a-text>
      </a-box>

      {/* Contador de preguntas */}
      <a-text 
        value={`Pregunta ${Math.min(currentQuestionIndex + 1, maxRounds)} / ${maxRounds}`} 
        position="0 -0.8 0" 
        color="#666" 
        align="center" 
        width="1.8"
      ></a-text>
      
      {/* Puntaje actual */}
      <a-text 
        value={`Puntaje: ${score}`} 
        position="0 -1.0 0" 
        color="#2196F3" 
        align="center" 
        width="1.8"
      ></a-text>
    </a-entity>
  );

  return (
    <VRPlaza
      onBack={onFinish}
      onProfile={() => {}}
      onSelectLevel={() => {}}
    >
      {screen}
    </VRPlaza>
  );
};

export default VRLevels;
