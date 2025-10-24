import React, { useEffect, useRef } from 'react';
import 'aframe';

export const VRPlaza = ({ children, onBack, onProfile, onSelectLevel, initialCameraPosition = '0 1.6 4', movementLocked = false }) => {
  const sceneRef = useRef(null);
  const screenRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    // Inicialización de la escena VR
    const scene = sceneRef.current;
    
    // Función para manejar el clic en la pantalla
    const handleScreenClick = (e) => {
      // Aquí puedes agregar lógica para manejar interacciones con la pantalla
      console.log('Pantalla clickeada', e.detail.intersection.point);
    };

    // Agregar evento de clic a la pantalla
    if (screenRef.current) {
      screenRef.current.addEventListener('click', handleScreenClick);
    }

    return () => {
      // Limpiar event listeners al desmontar
      if (screenRef.current) {
        screenRef.current.removeEventListener('click', handleScreenClick);
      }
    };
  }, []);

  // Función para cambiar la imagen de la pantalla
  const changeScreenImage = (imageUrl) => {
    if (screenRef.current) {
      screenRef.current.setAttribute('material', { src: imageUrl });
    }
  };

  // Función para mover la cámara a la posición inicial
  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.setAttribute('position', initialCameraPosition);
      cameraRef.current.setAttribute('rotation', '0 0 0');
    }
  };

  useEffect(() => {
    const cameraEl = cameraRef.current;

    const wasd = cameraEl && cameraEl.components && cameraEl.components['wasd-controls'];
    if (wasd) {
      if (movementLocked) {
        wasd.pause();
      } else {
        wasd.play();
      }
    }

    return () => {};
  }, [movementLocked]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Botones de interfaz */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={onSelectLevel}
          style={buttonStyle}
        >
          ⬅ Seleccionar nivel
        </button>
        <button 
          onClick={onProfile}
          style={buttonStyle}
        >
          ⬅ Perfil
        </button>
        <button 
          onClick={() => {
            resetCamera();
            if (onBack) onBack();
          }}
          style={buttonStyle}
        >
          ⬅ Volver
        </button>
      </div>

      {/* Escena A-Frame */}
      <a-scene ref={sceneRef}>
        {/* Cielo */}
        <a-sky color="#87CEEB"></a-sky>
        
        {/* Suelo */}
        <a-plane 
          color="#4CAF50" 
          height="100" 
          width="100" 
          rotation="-90 0 0"
        ></a-plane>

        {/* Fuente en el centro */}
        <a-cylinder 
          position="0 0.25 0" 
          radius="1.5" 
          height="0.1" 
          color="#2196F3"
        ></a-cylinder>

        {/* Pantalla central */}
        <a-entity 
          id="screen"
          ref={screenRef}
          position="0 2.2 0"
          rotation="0 0 0"
          geometry="primitive: plane; width: 2; height: 1.8"
          material="color: white; transparent: true; opacity: 1"
          class="clickable"
          cursor="rayOrigin: mouse"
          raycaster="objects: .clickable"
        >
          {/* Contenido JSX dinamico dentro de la pantalla */}
          <a-entity position="0 0 0.01">
            {children}
          </a-entity>
        </a-entity>

        {/* Caminos */}
        <a-plane 
          position="0 0.01 0" 
          rotation="-90 0 0" 
          width="1" 
          height="20" 
          color="#9E9E9E"
        ></a-plane>
        <a-plane 
          position="0 0.01 0" 
          rotation="-90 90 0" 
          width="1" 
          height="20" 
          color="#9E9E9E"
        ></a-plane>

        {/* Árboles */}
        {[
          { x: 4, z: -4 },
          { x: -4, z: -4 },
          { x: 2, z: -2 },
          { x: -2, z: -2 },
          { x: 4, z: 4 },
          { x: -4, z: 4 }
        ].map((pos, index) => (
          <a-entity key={index}>
            <a-cylinder 
              position={`${pos.x} 1 ${pos.z}`} 
              radius="0.2" 
              height="2" 
              color="#8B4513"
            ></a-cylinder>
            <a-sphere 
              position={`${pos.x} 2.5 ${pos.z}`} 
              radius="1" 
              color="#228B22"
            ></a-sphere>
          </a-entity>
        ))}

        {/* Cámara */}
        <a-entity 
          ref={cameraRef}
          id="camera"
          camera 
          look-controls 
          position={initialCameraPosition}
          wasd-controls="fly: false"
        ></a-entity>
      </a-scene>
    </div>
  );
};

// Estilos para los botones
const buttonStyle = {
  padding: '10px 14px',
  fontSize: '14px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  zIndex: '1000',
};

export default VRPlaza;
