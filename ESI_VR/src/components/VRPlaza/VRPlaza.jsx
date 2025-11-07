import React, { useEffect, useRef, useMemo } from 'react';
import 'aframe';

// Componente A-Frame para limitar la posición dentro de un rectángulo (barreras)
if (typeof window !== 'undefined' && window.AFRAME && !window.AFRAME.components['boundary']) {
  window.AFRAME.registerComponent('boundary', {
    schema: {
      minX: { type: 'number', default: -9.5 },
      maxX: { type: 'number', default: 9.5 },
      minZ: { type: 'number', default: -9.5 },
      maxZ: { type: 'number', default: 9.5 }
    },
    tick: function () {
      const p = this.el.object3D.position;
      // Limitar X y Z para no atravesar paredes
      if (p.x < this.data.minX) p.x = this.data.minX;
      if (p.x > this.data.maxX) p.x = this.data.maxX;
      if (p.z < this.data.minZ) p.z = this.data.minZ;
      if (p.z > this.data.maxZ) p.z = this.data.maxZ;
    }
  });
}

// Componente para hacer que un elemento mire siempre a la cámara (billboard)
if (typeof window !== 'undefined' && window.AFRAME && !window.AFRAME.components['face-camera']) {
  window.AFRAME.registerComponent('face-camera', {
    tick: function () {
      const sceneEl = this.el.sceneEl;
      if (!sceneEl || !sceneEl.camera) return;
      const cam = sceneEl.camera;
      const target = new window.THREE.Vector3();
      cam.getWorldPosition(target);
      const obj = this.el.object3D;
      obj.lookAt(target);
      obj.rotation.x = 0;
      obj.rotation.z = 0;
    }
  });
}

// Componente para evitar atravesar elementos marcados como .solid (colisión 2D simple)
if (typeof window !== 'undefined' && window.AFRAME && !window.AFRAME.components['no-pass-solids']) {
  window.AFRAME.registerComponent('no-pass-solids', {
    schema: {
      radius: { type: 'number', default: 0.35 }
    },
    init: function () {
      this.prev = this.el.object3D.position.clone();
      this.solids = Array.from(this.el.sceneEl.querySelectorAll('.solid'));
    },
    isColliding: function (px, pz) {
      const r = this.data.radius;
      for (const el of this.solids) {
        const obj = el.object3D;
        if (!obj) continue;
        const pos = obj.position;
        const geo = el.getAttribute('geometry') || {};
        // Considerar escala del objeto
        const sx = obj.scale && obj.scale.x ? obj.scale.x : 1;
        const sz = obj.scale && obj.scale.z ? obj.scale.z : 1;
        const rawW = (typeof geo.width === 'number' ? geo.width : parseFloat(geo.width)) || 0.5;
        const rawD = (typeof geo.depth === 'number' ? geo.depth : parseFloat(geo.depth)) || 0.5;
        const w = rawW * sx;
        const d = rawD * sz;
        const halfW = w / 2 + r;
        const halfD = d / 2 + r;
        if (Math.abs(px - pos.x) <= halfW && Math.abs(pz - pos.z) <= halfD) {
          return true;
        }
      }
      return false;
    },
    tick: function () {
      const p = this.el.object3D.position;
      const prev = this.prev;
      const nextX = p.x;
      const nextZ = p.z;

      // Resolver en ejes separados (sliding): primero X, luego Z
      // Probar mover solo en X, manteniendo Z previo
      if (this.isColliding(nextX, prev.z)) {
        // Intento intermedio para evitar saltos a través de objetos delgados
        const midX = (prev.x + nextX) * 0.5;
        if (!this.isColliding(midX, prev.z)) {
          p.x = midX;
        } else {
          // Bloquear X y mantener el anterior + un pequeño empuje fuera (epsilon)
          p.x = prev.x;
          const eps = 0.001;
          // pequeño ajuste lateral según dirección
          if (nextX > prev.x) p.x -= eps; else if (nextX < prev.x) p.x += eps;
        }
      }

      // Probar mover solo en Z, con X ya resuelto
      if (this.isColliding(p.x, nextZ)) {
        const midZ = (prev.z + nextZ) * 0.5;
        if (!this.isColliding(p.x, midZ)) {
          p.z = midZ;
        } else {
          p.z = prev.z;
          const eps = 0.001;
          if (nextZ > prev.z) p.z -= eps; else if (nextZ < prev.z) p.z += eps;
        }
      }

      // Actualizar última posición válida
      this.prev.copy(p);
    }
  });
}

export const VRPlaza = ({ children, onBack, onProfile, onSelectLevel, initialCameraPosition = '0 1.6 -8.2', movementLocked = false }) => {
  const sceneRef = useRef(null);
  const screenRef = useRef(null);
  const cameraRef = useRef(null);
  const posterImageRef = useRef(null);

  const puestos = useMemo(() => {
    const columnas = [-4, -2, 0, 2, 4];
    const filasZ = [3, 1, -1, -3, -5];
    const arr = [];
    let i = 0;
    for (const z of filasZ) {
      for (const x of columnas) {
        arr.push({ x, z, key: i++ });
      }
    }
    return arr;
  }, []);

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

  useEffect(() => {
    const img = new window.Image();
    img.src = process.env.PUBLIC_URL + '/download.png';
    img.onload = () => {
      const ratio = img.width / img.height;
      const targetWidth = 4.2;
      const computedHeight = targetWidth / ratio;
      if (posterImageRef.current) {
        posterImageRef.current.setAttribute('width', targetWidth);
        posterImageRef.current.setAttribute('height', computedHeight);
        posterImageRef.current.setAttribute('material', 'shader: flat; side: double; transparent: true; alphaTest: 0.01');
      }
    };
  }, []);

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
        <a-sky color="#f5efe6"></a-sky>
        
        {/* Suelo gris uniforme */}
        <a-plane 
          color="#9E9E9E" 
          height="20" 
          width="20" 
          rotation="-90 0 0"
        ></a-plane>


        {/* Pizarrón (limpio y clásico) */}
        {/* Tablero verde */}
        <a-plane
          position="0 2.0 -9.96"
          rotation="0 0 0"
          width="4.0"
          height="3.0"
          color="#1E6B2D"
          material="polygonOffset: true; polygonOffsetFactor: 4; polygonOffsetUnits: 2"
          render-order="1"
        ></a-plane>

        {/* Marco de madera al frente */}
        <a-box position="0 3.54 -9.94" width="4.2" height="0.18" depth="0.09" color="#6d4c41" material="shader: flat" render-order="2"></a-box>
        <a-box position="0 0.5 -9.85" width="4.2" height="0.14" depth="0.08" color="#6d4c41" material="shader: flat; polygonOffset: true; polygonOffsetFactor: -2; polygonOffsetUnits: -1" render-order="2"></a-box>
        <a-box position="-2.1 2.0 -9.94" width="0.14" height="3.2" depth="0.08" color="#6d4c41" material="shader: flat" render-order="2"></a-box>
        <a-box position="2.1 2.0 -9.94" width="0.14" height="3.2" depth="0.08" color="#6d4c41" material="shader: flat" render-order="2"></a-box>

        {/* Bandeja porta tizas */}
        <a-box position="0 0.52 -9.83" width="4.0" height="0.09" depth="0.08" color="#cfd8dc" material="shader: flat; polygonOffset: true; polygonOffsetFactor: -2; polygonOffsetUnits: -1" render-order="2"></a-box>

        {/* Área de juego dentro del pizarrón */}
        <a-entity 
          id="screen"
          ref={screenRef}
          position="0 2.0 -9.955"
          rotation="0 0 0"
          geometry="primitive: plane; width: 3.15; height: 1.48"
          material="color: white; transparent: true; opacity: 0; depthWrite: false; depthTest: false"
          class="clickable"
          cursor="rayOrigin: mouse"
          raycaster="objects: .clickable"
        >
          <a-entity position="0.05 0.12 0.01" scale="0.78 0.78 1">
            {children}
          </a-entity>
        </a-entity>

        {/* Póster del personaje al lado del pizarrón (sin transparencia) */}
        <a-plane
          position="-2.65 1.375 -9.94"
          width="1.1"
          height="2.75"
          material="transparent: true; opacity: 0"
        ></a-plane>
        <a-image
          ref={posterImageRef}
          src={process.env.PUBLIC_URL + '/download.png'}
          position="-2.65 1.375 -8.5"
          width="4.2"
          height="2.75"
          material="shader: flat; side: double; transparent: true; alphaTest: 0.01"
          face-camera
        ></a-image>

        {/* Paredes del aula */}
        <a-plane position="0 2 -10" rotation="0 0 0" width="20" height="4" color="#e8e3da"></a-plane>
        <a-plane position="0 2 10" rotation="0 180 0" width="20" height="4" color="#e8e3da"></a-plane>
        <a-plane position="-10 2 0" rotation="0 90 0" width="20" height="4" color="#e8e3da"></a-plane>
        <a-plane position="10 2 0" rotation="0 -90 0" width="20" height="4" color="#e8e3da"></a-plane>
        {/* Techo */}
        <a-plane position="0 4 0" rotation="90 0 0" width="20" height="20" color="#ded7cc"></a-plane>


        {/* Bancos con sillas (aula) */}
        {puestos.map(({ x, z, key }) => (
          <a-entity key={key}>
            {/* Mesa */}
            <a-box position={`${x} 0.75 ${z}`} width="0.9" height="0.05" depth="0.6" color="#6D4C41" class="solid"></a-box>
            {/* Patas de la mesa */}
            <a-box position={`${x - 0.42} 0.375 ${z - 0.27}`} width="0.05" height="0.75" depth="0.05" color="#6D4C41" class="solid"></a-box>
            <a-box position={`${x + 0.42} 0.375 ${z - 0.27}`} width="0.05" height="0.75" depth="0.05" color="#795548" class="solid"></a-box>
            <a-box position={`${x - 0.42} 0.375 ${z + 0.27}`} width="0.05" height="0.75" depth="0.05" color="#795548" class="solid"></a-box>
            <a-box position={`${x + 0.42} 0.375 ${z + 0.27}`} width="0.05" height="0.75" depth="0.05" color="#795548" class="solid"></a-box>

            {/* Silla detrás de la mesa, apuntando hacia adelante (al pizarrón) */}
            <a-box position={`${x} 0.45 ${z + 0.5}`} width="0.45" height="0.05" depth="0.45" color="#607D8B" class="solid"></a-box>
            {/* Patas de la silla */}
            <a-box position={`${x - 0.2} 0.225 ${z + 0.28}`} width="0.05" height="0.45" depth="0.05" color="#455A64" class="solid"></a-box>
            <a-box position={`${x + 0.2} 0.225 ${z + 0.28}`} width="0.05" height="0.45" depth="0.05" color="#455A64" class="solid"></a-box>
            <a-box position={`${x - 0.2} 0.225 ${z + 0.72}`} width="0.05" height="0.45" depth="0.05" color="#455A64" class="solid"></a-box>
            <a-box position={`${x + 0.2} 0.225 ${z + 0.72}`} width="0.05" height="0.45" depth="0.05" color="#455A64" class="solid"></a-box>
            {/* Respaldo de la silla (detrás del alumno) */}
            <a-box position={`${x} 0.7 ${z + 0.72}`} width="0.45" height="0.4" depth="0.05" color="#607D8B" class="solid"></a-box>
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
        boundary="minX: -9.2; maxX: 9.2; minZ: -9.75; maxZ: 9.2"
        no-pass-solids="radius: 0.2"
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

export default VRPlaza
