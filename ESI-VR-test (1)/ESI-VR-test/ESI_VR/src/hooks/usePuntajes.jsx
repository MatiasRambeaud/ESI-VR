import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export const usePuntajes = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [puntajes, setPuntajes] = useState([]);

  // Función para guardar un puntaje
  const guardarPuntaje = async (scoreData) => {
    if (!user) {
      setError('Usuario no autenticado');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const puntajesRef = collection(db, 'puntajes');
      const docRef = await addDoc(puntajesRef, {
        userId: user.uid,
        email: user.email,
        score: scoreData.score,
        totalQuestions: scoreData.totalQuestions,
        questionIndices: scoreData.questionIndices,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      // Actualizar la lista local de puntajes
      await obtenerHistorialPuntajes();
      
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar el puntaje:', error);
      setError('Error al guardar el puntaje: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el historial de puntajes del usuario
  const obtenerHistorialPuntajes = async () => {
    if (!user) {
      setError('Usuario no autenticado');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const puntajesRef = collection(db, 'puntajes');
      const q = query(
        puntajesRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const puntajesData = [];

      querySnapshot.forEach((doc) => {
        puntajesData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setPuntajes(puntajesData);
      
      return puntajesData;
    } catch (error) {
      console.error('Error al obtener el historial de puntajes:', error);
      setError('Error al obtener el historial: ' + error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener estadísticas del usuario
  const obtenerEstadisticas = () => {
    if (puntajes.length === 0) {
      return {
        totalQuizzes: 0,
        promedioPuntaje: 0,
        mejorPuntaje: 0,
        puntajeMasReciente: 0
      };
    }

    const scores = puntajes.map(p => p.score);
    const totalQuizzes = puntajes.length;
    const promedioPuntaje = scores.reduce((sum, score) => sum + score, 0) / totalQuizzes;
    const mejorPuntaje = Math.max(...scores);
    const puntajeMasReciente = puntajes[0]?.score || 0;

    return {
      totalQuizzes,
      promedioPuntaje: Math.round(promedioPuntaje * 100) / 100,
      mejorPuntaje,
      puntajeMasReciente
    };
  };

  // Función para guardar una respuesta individual en tiempo real
  const guardarRespuestaIndividual = async (respuestaData) => {
    if (!user) {
      setError('Usuario no autenticado');
      return null;
    }

    try {
      const respuestasRef = collection(db, 'respuestas');
      
      const docRef = await addDoc(respuestasRef, {
        userId: user.uid,
        email: user.email,
        questionIndex: respuestaData.questionIndex,
        selectedAnswerIndex: respuestaData.selectedAnswerIndex,
        correctAnswerIndex: respuestaData.correctAnswerIndex,
        isCorrect: respuestaData.isCorrect,
        quizSessionId: respuestaData.quizSessionId,
        currentScore: respuestaData.currentScore,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error al guardar la respuesta individual:', error);
      setError('Error al guardar la respuesta: ' + error.message);
      return null;
    }
  };

  // Función para actualizar el puntaje acumulado en tiempo real
  const actualizarPuntajeRealTime = async (sessionId, nuevoPuntaje) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      const sesionesRef = collection(db, 'sesionesQuiz');
      const docRef = doc(sesionesRef, sessionId);

      // Verificar si el documento existe
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Actualizar el documento existente
        await updateDoc(docRef, {
          puntajeActual: nuevoPuntaje,
          ultimaActualizacion: serverTimestamp()
        });
      } else {
        // Crear nuevo documento de sesión
        await setDoc(docRef, {
          userId: user.uid,
          email: user.email,
          puntajeActual: nuevoPuntaje,
          preguntaActual: 0,
          totalPreguntas: 5,
          timestamp: serverTimestamp(),
          ultimaActualizacion: serverTimestamp(),
          status: 'enCurso'
        });
      }
    } catch (error) {
      console.error('Error al actualizar puntaje en tiempo real:', error);
      setError('Error al actualizar puntaje: ' + error.message);
    }
  };

  // Función para limpiar errores
  const limpiarError = () => {
    setError(null);
  };

  // Cargar historial automáticamente cuando el usuario cambie
  useEffect(() => {
    if (user) {
      obtenerHistorialPuntajes();
    } else {
      setPuntajes([]);
    }
  }, [user]);

  return {
    // Estados
    isLoading,
    error,
    puntajes,
    
    // Funciones
    guardarPuntaje,
    obtenerHistorialPuntajes,
    obtenerEstadisticas,
    limpiarError,
    // Nuevas funciones para tiempo real
    guardarRespuestaIndividual,
    actualizarPuntajeRealTime
  };
};
