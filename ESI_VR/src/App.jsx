import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PerfilUsuario from "./components/views/PerfilUsuario";
import NivelGanado from "/components/views/NivelGanado"
import Error from "/components/views/Error";
import InicioSesion from "/components/views/InicioSesion";
import TeEquivocaste from "/components/views/TeEquivocaste";
import SeleccionNivel from "/components/views/SeleccionNivel";
import VistaExplicacion from "./components/views/vistaexplicacion";
function App() {
    return (
        <PerfilUsuario/>
    );
}

function App() {
    return (
        <NivelGanado/>
    );
}

function App() {
    return (
        <Error/>
    )
}

function App() {
  return <InicioSesion />;
}

function App() {
  return <SeleccionNivel/>;
}

function App() {
    return <TeEquivocaste/>;
  }



export default App;