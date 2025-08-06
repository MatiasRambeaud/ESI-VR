import Alerta from './alerta';
import CajaMensaje from './mensajepermiso';

const MensajeCamara = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px',
    backgroundColor: '#fdf7cc',
    minHeight: '100vh'
  }}>
    <Alerta />
    <CajaMensaje mensaje="ESI necesita acceder a los permisos de la cámara para funcionar correctamente." />
  </div>
);

export default MensajeCamara;
