import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
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

      console.log('Puntaje guardado exitosamente con ID:', docRef.id);
      
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
      console.log('Historial de puntajes obtenido:', puntajesData.length, 'registros');
      
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
    limpiarError
  };
};
