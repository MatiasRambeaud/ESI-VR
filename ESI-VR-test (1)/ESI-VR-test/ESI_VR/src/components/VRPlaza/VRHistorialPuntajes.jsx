import React, { useEffect, useRef } from 'react';
import { VRPlaza } from './VRPlaza';
import { usePuntajes } from '../../hooks/usePuntajes';

const VRHistorialPuntajes = ({ onBack }) => {
  const { puntajes, obtenerEstadisticas, isLoading, error } = usePuntajes();
  const backButtonRef = useRef(null);

  const estadisticas = obtenerEstadisticas();

  useEffect(() => {
    const handleBackClick = () => {
      if (onBack) onBack();
    };

    if (backButtonRef.current) {
      backButtonRef.current.addEventListener('click', handleBackClick);
    }

    return () => {
      if (backButtonRef.current) {
        backButtonRef.current.removeEventListener('click', handleBackClick);
      }
    };
  }, [onBack]);

  const screen = (
    <a-entity position="0 0 0.01">
      <a-plane color="#f0f0f0" width="1.8" height="1.5" position="0 0 -0.01" opacity="0.9"></a-plane>

      {/* Título */}
      <a-plane color="#2196F3" width="1.6" height="0.4" position="0 0.55 0"></a-plane>
      <a-text value="Historial de Puntajes" position="0 0.55 0.01" color="#fff" align="center" width="1.5"></a-text>

      {/* Estadísticas */}
      <a-text 
        value={`Total de Quizzes: ${estadisticas.totalQuizzes}`} 
        position="0 0.2 0" 
        color="#333" 
        align="center" 
        width="1.6"
      ></a-text>

      <a-text 
        value={`Mejor Puntaje: ${estadisticas.mejorPuntaje}/5`} 
        position="0 0.05 0" 
        color="#333" 
        align="center" 
        width="1.6"
      ></a-text>

      <a-text 
        value={`Promedio: ${estadisticas.promedioPuntaje}/5`} 
        position="0 -0.1 0" 
        color="#333" 
        align="center" 
        width="1.6"
      ></a-text>

      <a-text 
        value={`Último Puntaje: ${estadisticas.puntajeMasReciente}/5`} 
        position="0 -0.25 0" 
        color="#333" 
        align="center" 
        width="1.6"
      ></a-text>

      {/* Estado de carga o error */}
      {isLoading && (
        <a-text 
          value="Cargando historial..." 
          position="0 -0.4 0" 
          color="#FF9800" 
          align="center" 
          width="1.6"
        ></a-text>
      )}

      {error && (
        <a-text 
          value={`Error: ${error}`} 
          position="0 -0.4 0" 
          color="#F44336" 
          align="center" 
          width="1.6"
        ></a-text>
      )}

      {/* Botón de volver */}
      <a-box 
        ref={backButtonRef}
        position="0 -0.6 0" 
        width="1.0" 
        height="0.2" 
        depth="0.05" 
        color="#2196F3" 
        class="clickable"
      >
        <a-text value="Volver" position="0 0 0.026" color="#fff" align="center" width="1.0"></a-text>
      </a-box>
    </a-entity>
  );

  return (
    <VRPlaza
      onBack={onBack}
      onProfile={() => {}}
      onSelectLevel={() => {}}
    >
      {screen}
    </VRPlaza>
  );
};

export default VRHistorialPuntajes;
