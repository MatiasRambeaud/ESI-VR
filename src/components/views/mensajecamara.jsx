
import alerta from './alerta';
import cajamensaje from './mensajepermiso';

const mensajecamara = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px',
    backgroundColor: '#fdf7cc',
    minHeight: '100vh'
  }}>
    <alerta />
    <caja-mensaje mensaje="ESI necesita acceder a los permisos de la cámara para funcionar correctamente." />
  </div>
);

export default mensajecamara;
