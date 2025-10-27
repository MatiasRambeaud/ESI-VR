import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import VRLogin from './components/VRPlaza/VRLogin';
import VRLevels from './components/VRPlaza/VRLevels';

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

  return (
    <VRLogin
      onSelectLevel={() => setView('levels')}
      onBack={() => {}}
      onProfile={() => {}}
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
