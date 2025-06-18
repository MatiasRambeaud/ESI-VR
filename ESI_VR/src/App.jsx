import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PerfilUsuario from "./components/views/PerfilUsuario";
import NivelGanado from "/components/views/NivelGanado";
import Error from "/components/views/Error";
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

export default App;