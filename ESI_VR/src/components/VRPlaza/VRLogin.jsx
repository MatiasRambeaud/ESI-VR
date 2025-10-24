import React, { useState, useEffect, useRef } from 'react';
import { VRPlaza } from './VRPlaza';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';

const VRLogin = ({ onSelectLevel, onBack, onProfile }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const loginButtonRef = useRef(null);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Event listeners para A-Frame
    const handleUsernameClick = () => {
      setIsEditingUsername(true);
      setIsEditingPassword(false);
      setCurrentInput(username);
      setError('');
      console.log('Campo usuario clickeado');
    };

    const handlePasswordClick = () => {
      setIsEditingPassword(true);
      setIsEditingUsername(false);
      setCurrentInput(password);
      setError('');
      console.log('Campo contraseña clickeado');
    };

    const handleLoginClick = () => {
      console.log('Botón login clickeado');
      if (username && password) {
        console.log('Iniciando sesión con:', { username, password });
        setError('');
        // Aquí iría la lógica de autenticación real
      } else {
        setError('Por favor, completa todos los campos');
      }
    };

    // Agregar event listeners
    if (usernameRef.current) {
      usernameRef.current.addEventListener('click', handleUsernameClick);
    }
    if (passwordRef.current) {
      passwordRef.current.addEventListener('click', handlePasswordClick);
    }
    if (loginButtonRef.current) {
      loginButtonRef.current.addEventListener('click', handleLoginClick);
    }
    if (googleButtonRef.current) {
      googleButtonRef.current.addEventListener('click', handleGoogleSignIn);
    }

    // Cleanup
    return () => {
      if (usernameRef.current) {
        usernameRef.current.removeEventListener('click', handleUsernameClick);
      }
      if (passwordRef.current) {
        passwordRef.current.removeEventListener('click', handlePasswordClick);
      }
      if (loginButtonRef.current) {
        loginButtonRef.current.removeEventListener('click', handleLoginClick);
      }
      if (googleButtonRef.current) {
        googleButtonRef.current.removeEventListener('click', handleGoogleSignIn);
      }
    };
  }, [username, password]);

  // Funciones para manejar input de teclado
  const handleKeyPress = (key) => {
    if (isEditingUsername) {
      if (key === 'Backspace') {
        setUsername(prev => prev.slice(0, -1));
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (key === 'Enter') {
        setIsEditingUsername(false);
        setCurrentInput('');
      } else if (key.length === 1) {
        setUsername(prev => prev + key);
        setCurrentInput(prev => prev + key);
      }
    } else if (isEditingPassword) {
      if (key === 'Backspace') {
        setPassword(prev => prev.slice(0, -1));
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (key === 'Enter') {
        setIsEditingPassword(false);
        setCurrentInput('');
      } else if (key.length === 1) {
        setPassword(prev => prev + key);
        setCurrentInput(prev => prev + key);
      }
    }
  };

  // Event listener global para teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isEditingUsername || isEditingPassword) {
        if (event.key === 'f' || event.key === 'F') {
          event.preventDefault();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          event.stopPropagation();
        }
        if (event.key === 'Backspace') {
          handleKeyPress('Backspace');
        } else if (event.key === 'Enter') {
          handleKeyPress('Enter');
        } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
          handleKeyPress(event.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingUsername, isEditingPassword]);

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
        value="Iniciar Sesion"
        position="0 0.6 0"
        color="#333"
        align="center"
        width="1.8"
      ></a-text>

      {/* Campo de usuario */}
      <a-text
        value="Usuario:"
        position="-0.7 0.2 0"
        color="#333"
        align="left"
        width="0.8"
      ></a-text>
      <a-box
        ref={usernameRef}
        id="username-input"
        position="0.4 0.2 0"
        width="0.8"
        height="0.2"
        depth="0.05"
        color={isEditingUsername ? "#4CAF50" : "#fff"}
        class="clickable"
        events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
      >
        <a-text
          value={username || (isEditingUsername ? "Escribiendo..." : "Click para escribir")}
          position="0 0 0.026"
          color="#000"
          align="center"
          width="0.8"
        ></a-text>
      </a-box>

      {/* Campo de contraseña */}
      <a-text
        value="Contrasena:"
        position="-0.7 -0.2 0"
        color="#333"
        align="left"
        width="1.0"
      ></a-text>
      <a-box
        ref={passwordRef}
        id="password-input"
        position="0.4 -0.2 0"
        width="0.8"
        height="0.2"
        depth="0.05"
        color={isEditingPassword ? "#4CAF50" : "#fff"}
        class="clickable"
        events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
      >
        <a-text
          value={password ? '*'.repeat(password.length) : (isEditingPassword ? "Escribiendo..." : "Click para escribir")}
          position="0 0 0.026"
          color="#000"
          align="center"
          width="0.8"
        ></a-text>
      </a-box>

      {/* Botón de inicio de sesión */}
      <a-box
        ref={loginButtonRef}
        id="login-button"
        position="0 -0.6 0"
        width="1.0"
        height="0.2"
        depth="0.05"
        color="#2196F3"
        class="clickable"
        events="mouseenter: scale: 1.05 1.05 1.05; mouseleave: scale: 1 1 1"
      >
        <a-text
          value="Ingresar"
          position="0 0 0.026"
          color="#fff"
          align="center"
          width="1.0"
        ></a-text>
      </a-box>

      {/* Botón de Google Sign-In */}
      <a-box
        ref={googleButtonRef}
        id="google-signin-button"
        position="0 -0.9 0"
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
          position="0 -0.4 0"
          color="red"
          align="center"
          width="1.6"
          wrap-count="20"
        ></a-text>
      )}

      {/* Indicador de edición */}
      {(isEditingUsername || isEditingPassword) && (
        <a-entity position="0 -1.2 0">
          <a-text
            value={`Editando ${isEditingUsername ? 'usuario' : 'contraseña'}: ${currentInput}`}
            color="#2196F3"
            align="center"
            width="2"
          ></a-text>
          <a-text
            value="Presiona Enter para confirmar o Backspace para borrar"
            position="0 -0.1 0"
            color="#666"
            align="center"
            width="2"
          ></a-text>
        </a-entity>
      )}
    </a-entity>
  );

  return (
    <VRPlaza
      onBack={onBack}
      onProfile={onProfile}
      onSelectLevel={onSelectLevel}
      movementLocked={isEditingUsername || isEditingPassword}
    >
      {loginForm}
    </VRPlaza>
  );
};

export default VRLogin;
