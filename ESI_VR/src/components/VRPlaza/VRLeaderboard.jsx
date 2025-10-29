import React, { useEffect, useRef, useState } from 'react';
import { VRPlaza } from './VRPlaza';
import { usePuntajes } from '../../hooks/usePuntajes';

const VRLeaderboard = ({ onBack }) => {
  const { obtenerLeaderboardTop10, isLoading, error } = usePuntajes();
  const [top10, setTop10] = useState([]);
  const backButtonRef = useRef(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const load = async () => {
      const data = await obtenerLeaderboardTop10();
      setTop10(data);
    };
    load();
  }, []);

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

  const colorForRank = (rank) => {
    if (rank === 1) return '#FFD700'; // Oro
    if (rank === 2) return '#C0C0C0'; // Plata
    if (rank === 3) return '#CD7F32'; // Bronce
    return '#2196F3';
  };

  const screen = (
    <a-entity position="0 0 0.01">
      <a-plane color="#f0f0f0" width="2.0" height="2.0" position="0 0 -0.01" opacity="0.95"></a-plane>

      <a-plane color="#2196F3" width="1.8" height="0.35" position="0 0.85 0"></a-plane>
      <a-text value="Leaderboard - Top 10" position="0 0.85 0.01" color="#fff" align="center" width="1.7"></a-text>

      {isLoading && (
        <a-text value="Cargando..." position="0 0.5 0" color="#FF9800" align="center" width="1.6"></a-text>
      )}
      {error && (
        <a-text value={`Error: ${error}`} position="0 0.5 0" color="#F44336" align="center" width="1.6"></a-text>
      )}

      {top10.slice(0,10).map((item, index) => (
        <a-entity key={index} position={`0 ${0.55 - index * 0.18} 0.01`}>
          <a-plane color={colorForRank(index + 1)} width="1.6" height="0.14" opacity="0.9"></a-plane>
          {/* Posición */}
          <a-text value={`#${index + 1}`} position="-0.74 0 0.01" color="#fff" align="left" width="0.35"></a-text>
          {/* Email/Usuario (negro, más chico) */}
          <a-text value={`${item.email || item.userId || 'Usuario'}`} position="-0.56 0 0.01" color="#000" align="left" width="0.55" wrap-count="18"></a-text>
          {/* Aciertos (negro, tamaño uniforme) */}
          <a-text value={`Aciertos: ${(item.score ?? 0)}/${(item.totalQuestions ?? 5)}`} position="0.08 0 0.01" color="#000" align="left" width="1.2"></a-text>
          {/* Porcentaje (negro, mismo tamaño, alineado a la derecha) */}
          <a-text value={`${Math.round(((item.score ?? 0) / Math.max(1, (item.totalQuestions ?? 0))) * 100)}%`} position="0.74 0 0.01" color="#000" align="right" width="1.2"></a-text>
        </a-entity>
      ))}

      <a-box ref={backButtonRef} position="0 -0.8 0" width="1.0" height="0.2" depth="0.05" color="#9E9E9E" class="clickable">
        <a-text value="← Volver" position="0 0 0.026" color="#fff" align="center" width="1.0"></a-text>
      </a-box>
    </a-entity>
  );

  return (
    <VRPlaza onBack={onBack} onProfile={() => {}} onSelectLevel={() => {}}>
      {screen}
    </VRPlaza>
  );
};

export default VRLeaderboard;
