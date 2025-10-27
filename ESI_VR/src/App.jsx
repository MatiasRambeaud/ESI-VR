import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import VRLogin from './components/VRPlaza/VRLogin';
import VRLevels from './components/VRPlaza/VRLevels';
import VRHistorialPuntajes from './components/VRPlaza/VRHistorialPuntajes';
import VRPlaza from './components/VRPlaza/VRPlaza';

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState('login');
  const [selectedNivel, setSelectedNivel] = useState(null); // Nivel educativo seleccionado

  // Vista de selección de nivel
  if (view === 'selectLevel') {
    return (
      <VRSelectLevel
        onBack={() => setView('login')}
        onSelectNivel={(nivel) => {
          setSelectedNivel(nivel);
          setView('levels');
        }}
      />
    );
  }

  // Vista del cuestionario (levels)
  if (view === 'levels') {
    return (
      <VRLevels
        nivelEducativo={selectedNivel}
        onFinish={() => setView('login')}
        onRestart={() => setView('selectLevel')}
      />
    );
  }

  // Vista de historial
  if (view === 'historial') {
    return (
      <VRHistorialPuntajes
        onBack={() => setView('login')}
      />
    );
  }

  // Vista de login (inicial)
  return (
    <VRLogin
      onSelectLevel={() => setView('selectLevel')}
      onBack={() => {}}
      onProfile={() => {}}
      onHistorial={() => setView('historial')}
    />
  );
}

// Componente para selección de nivel educativo
function VRSelectLevel({ onBack, onSelectNivel }) {
  const nivelRefs = {
    inicial: React.useRef(null),
    primario: React.useRef(null),
    secundario: React.useRef(null),
    back: React.useRef(null)
  };

  React.useEffect(() => {
    const handleNivelClick = (nivel) => () => {
      onSelectNivel(nivel);
    };

    const handleBackClick = () => {
      onBack();
    };

    if (nivelRefs.inicial.current) {
      nivelRefs.inicial.current.addEventListener('click', handleNivelClick('inicial'));
    }
    if (nivelRefs.primario.current) {
      nivelRefs.primario.current.addEventListener('click', handleNivelClick('primario'));
    }
    if (nivelRefs.secundario.current) {
      nivelRefs.secundario.current.addEventListener('click', handleNivelClick('secundario'));
    }
    if (nivelRefs.back.current) {
      nivelRefs.back.current.addEventListener('click', handleBackClick);
    }

    return () => {
      if (nivelRefs.inicial.current) {
        nivelRefs.inicial.current.removeEventListener('click', handleNivelClick('inicial'));
      }
      if (nivelRefs.primario.current) {
        nivelRefs.primario.current.removeEventListener('click', handleNivelClick('primario'));
      }
      if (nivelRefs.secundario.current) {
        nivelRefs.secundario.current.removeEventListener('click', handleNivelClick('secundario'));
      }
      if (nivelRefs.back.current) {
        nivelRefs.back.current.removeEventListener('click', handleBackClick);
      }
    };
  }, [onBack, onSelectNivel]);

  const screen = (
    <a-entity position="0 0 0.01">
      {/* Fondo */}
      <a-plane color="#f0f0f0" width="2.0" height="2.0" position="0 0 -0.01" opacity="0.95"></a-plane>

      {/* Título */}
      <a-plane color="#2196F3" width="1.8" height="0.4" position="0 0.9 0"></a-plane>
      <a-text value="Selecciona un Nivel Educativo" position="0 0.9 0.01" color="#fff" align="center" width="1.7" font-size="40"></a-text>

      {/* Botón Nivel Inicial */}
      <a-box 
        ref={nivelRefs.inicial}
        position="0 0.4 0" 
        width="1.4" 
        height="0.25" 
        depth="0.05" 
        color="#4CAF50" 
        class="clickable"
      >
        <a-text value="NIVEL INICIAL" position="0 0 0.026" color="#fff" align="center" width="1.3" font-size="32"></a-text>
        <a-text value="Edad: 3-5 años" position="0 -0.05 0.026" color="#fff" align="center" width="1.3" font-size="20"></a-text>
      </a-box>

      {/* Botón Nivel Primario */}
      <a-box 
        ref={nivelRefs.primario}
        position="0 0.05 0" 
        width="1.4" 
        height="0.25" 
        depth="0.05" 
        color="#FF9800" 
        class="clickable"
      >
        <a-text value="NIVEL PRIMARIO" position="0 0 0.026" color="#fff" align="center" width="1.3" font-size="32"></a-text>
        <a-text value="Edad: 6-12 años" position="0 -0.05 0.026" color="#fff" align="center" width="1.3" font-size="20"></a-text>
      </a-box>

      {/* Botón Nivel Secundario */}
      <a-box 
        ref={nivelRefs.secundario}
        position="0 -0.3 0" 
        width="1.4" 
        height="0.25" 
        depth="0.05" 
        color="#9C27B0" 
        class="clickable"
      >
        <a-text value="NIVEL SECUNDARIO" position="0 0 0.026" color="#fff" align="center" width="1.3" font-size="32"></a-text>
        <a-text value="Edad: 13+ años" position="0 -0.05 0.026" color="#fff" align="center" width="1.3" font-size="20"></a-text>
      </a-box>

      {/* Botón Volver */}
      <a-box 
        ref={nivelRefs.back}
        position="0 -0.7 0" 
        width="1.0" 
        height="0.2" 
        depth="0.05" 
        color="#9E9E9E" 
        class="clickable"
      >
        <a-text value="← Volver" position="0 0 0.026" color="#fff" align="center" width="1.0"></a-text>
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
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
