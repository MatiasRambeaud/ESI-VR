import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PerfilUsuario from "./components/views/PerfilUsuario";
import NivelGanado from "/components/views/NivelGanado";
<<<<<<< HEAD
import Error from "/components/views/Error";
=======
import InicioSesion from "/components/views/InicioSesion";
>>>>>>> b69170ac0b6757baeaaf60dd493110e993c7e41f
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



export default App;