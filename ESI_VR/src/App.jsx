import React, { useState } from 'react';
import VRLogin from './components/VRPlaza/VRLogin';
import VRLevels from './components/VRPlaza/VRLevels';

function App() {
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

export default App;
