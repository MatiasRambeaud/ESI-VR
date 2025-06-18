import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PerfilUsuario from "./components/views/PerfilUsuario";
import NivelGanado from "./components/views/NivelGanado";
import SeleccionarNivel from "./components/views/seleccionar-nivel";
function App() {
    return (
        <PerfilUsuario/>,
        <NivelGanado/>,
        <SeleccionarNivel/>

    );
}

export default App;