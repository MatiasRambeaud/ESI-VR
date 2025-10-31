import React, { useState, useEffect, useRef } from 'react';
import { VRPlaza } from './VRPlaza';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';

const VRLogin = ({ onSelectLevel, onBack, onProfile, onHistorial, onLeaderboard }) => {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginButtonRef = useRef(null);
  const googleButtonRef = useRef(null);
  const historialButtonRef = useRef(null);
  const leaderboardButtonRef = useRef(null);

  useEffect(() => {
    // Event listeners para A-Frame
    const handleLoginClick = () => {
      console.log('Botón start quiz clickeado');
      if (user) {
        onSelectLevel();
      }
    };

    const handleLogoutClick = async () => {
      console.log('Botón logout clickeado');
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        setError('Error al cerrar sesión');
      }
    };

    const handleHistorialClick = () => {
      console.log('Botón historial clickeado');
      if (onHistorial) onHistorial();
    };

    const handleLeaderboardClick = () => {
      console.log('Botón leaderboard clickeado');
      if (onLeaderboard) onLeaderboard();
    };

    // Agregar event listeners
    if (loginButtonRef.current) {
      loginButtonRef.current.addEventListener('click', handleLoginClick);
    }
    if (googleButtonRef.current) {
      if (user) {
        googleButtonRef.current.addEventListener('click', handleLogoutClick);
      } else {
        googleButtonRef.current.addEventListener('click', handleGoogleSignIn);
      }
    }
    if (historialButtonRef.current) {
      historialButtonRef.current.addEventListener('click', handleHistorialClick);
    }
    if (leaderboardButtonRef.current) {
      leaderboardButtonRef.current.addEventListener('click', handleLeaderboardClick);
    }

    // Cleanup
    return () => {
      if (loginButtonRef.current) {
        loginButtonRef.current.removeEventListener('click', handleLoginClick);
      }
      if (googleButtonRef.current) {
        if (user) {
          googleButtonRef.current.removeEventListener('click', handleLogoutClick);
        } else {
          googleButtonRef.current.removeEventListener('click', handleGoogleSignIn);
        }
      }
      if (historialButtonRef.current) {
        historialButtonRef.current.removeEventListener('click', handleHistorialClick);
      }
      if (leaderboardButtonRef.current) {
        leaderboardButtonRef.current.removeEventListener('click', handleLeaderboardClick);
      }
    };
  }, [user]);

  // Eliminado: manejo de teclado para inputs manuales, solo Google Sign-In

  // Función para iniciar sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      // El usuario ha iniciado sesión correctamente
      // Firebase maneja la sesión automáticamente
      console.log('Usuario autenticado con Google:', result.user);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Si el usuario ya está autenticado, mostrar interfaz de bienvenida
  if (user) {
    const welcomeForm = (
      <a-entity position="0 0 0.01">
        {/* Fondo del formulario */}
        <a-plane
          color="#f0f0f0"
          width="1.8"
          height="1.5"
          position="0 0 -0.01"
          opacity="0.8"
        ></a-plane>

        {/* Título */}
        <a-text
          value="¡Bienvenido!"
          position="0 0.6 0"
          color="#333"
          align="center"
          width="1.8"
        ></a-text>

        {/* Información del usuario */}
        <a-text
          value={`Usuario: ${user.email || user.displayName || 'Usuario'}`}
          position="0 0.2 0"
          color="#333"
          align="center"
          width="1.6"
        ></a-text>

        {/* Botón para comenzar el quiz */}
        <a-box
          ref={loginButtonRef}
          id="start-quiz-button"
          position="0 -0.2 0"
          width="1.0"
          height="0.2"
          depth="0.05"
          color="#4CAF50"
          class="clickable"
          events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
        >
          <a-text
            value="Comenzar Quiz"
            position="0 0 0.026"
            color="#fff"
            align="center"
            width="1.0"
          ></a-text>
        </a-box>

        {/* Botón para ver historial */}
        <a-box
          ref={historialButtonRef}
          id="historial-button"
          position="0 -0.45 0"
          width="1.0"
          height="0.2"
          depth="0.05"
          color="#9C27B0"
          class="clickable"
          events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
        >
          <a-text
            value="Ver Historial"
            position="0 0 0.026"
            color="#fff"
            align="center"
            width="0.8"
          ></a-text>
        </a-box>

        {/* Botón para ver leaderboard */}
        <a-box
          ref={leaderboardButtonRef}
          id="leaderboard-button"
          position="0 -0.7 0"
          width="1.0"
          height="0.2"
          depth="0.05"
          color="#FF9800"
          class="clickable"
          events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
        >
          <a-text
            value="Leaderboard"
            position="0 0 0.026"
            color="#fff"
            align="center"
            width="0.8"
          ></a-text>
        </a-box>

        {/* Botón para cerrar sesión */}
        <a-box
          ref={googleButtonRef}
          id="logout-button"
          position="0 -1.0 0"
          width="1.0"
          height="0.2"
          depth="0.05"
          color="#F44336"
          class="clickable"
          events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
        >
          <a-text
            value="Cerrar Sesión"
            position="0 0 0.026"
            color="#fff"
            align="center"
            width="0.8"
          ></a-text>
        </a-box>
      </a-entity>
    );

    return (
      <VRPlaza
        onBack={onBack}
        onProfile={onProfile}
        onSelectLevel={onSelectLevel}
        movementLocked={false}
      >
        {welcomeForm}
      </VRPlaza>
    );
  }

  // Contenido JSX que se renderizará en la pantalla VR
  const loginForm = (
    <a-entity position="0 0 0.01">
      {/* Fondo del formulario */}
      <a-plane
        color="#f0f0f0"
        width="1.8"
        height="1.5"
        position="0 0 -0.01"
        opacity="0.8"
      ></a-plane>

      {/* Título */}
      <a-text
        value="Iniciar Sesión"
        position="0 0.6 0"
        color="#333"
        align="center"
        width="1.8"
      ></a-text>

      {/* Botón de Google Sign-In */}
      <a-box
        ref={googleButtonRef}
        id="google-signin-button"
        position="0 -0.2 0"
        width="1.0"
        height="0.2"
        depth="0.05"
        color="#DB4437"
        class="clickable"
        events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
      >
        <a-text
          value={isLoading ? 'Cargando...' : 'Iniciar con Google'}
          position="0 0 0.026"
          color="#fff"
          align="center"
          width="0.8"
        ></a-text>
      </a-box>

      {/* Mensaje de error */}
      {error && (
        <a-text
          value={error.length > 50 ? error.substring(0, 50) + '...' : error}
          position="0 -0.45 0"
          color="red"
          align="center"
          width="1.6"
          wrap-count="20"
        ></a-text>
      )}
    </a-entity>
  );

  return (
    <VRPlaza
      onBack={onBack}
      onProfile={onProfile}
      onSelectLevel={onSelectLevel}
      movementLocked={false}
    >
      {loginForm}
    </VRPlaza>
  );
};

export default VRLogin;
