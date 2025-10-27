import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import VRLogin from './components/VRPlaza/VRLogin';
import VRLevels from './components/VRPlaza/VRLevels';
import VRHistorialPuntajes from './components/VRPlaza/VRHistorialPuntajes';

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState('login');

  if (view === 'levels') {
    return (
      <VRLevels
        onFinish={() => setView('login')}
      />
    );
  }

  if (view === 'historial') {
    return (
      <VRHistorialPuntajes
        onBack={() => setView('login')}
      />
    );
  }

  return (
    <VRLogin
      onSelectLevel={() => setView('levels')}
      onBack={() => {}}
      onProfile={() => {}}
      onHistorial={() => setView('historial')}
    />
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
