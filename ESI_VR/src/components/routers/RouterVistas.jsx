import { BrowserRouter, Routes, Route } from "react-router-dom";
import PerfilUsuario from "../views/PerfilUsuario";
import NivelGanado from "../views/NivelGanado";
import Error from "../views/Error";
import InicioSesion from "../views/InicioSesion";
import TeEquivocaste from "../views/TeEquivocaste";
import SeleccionNivel from "../views/SeleccionNivel";
import VistaExplicacion from "../views/vistaexplicacion";

export function RouterVistas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/perfil" element={<PerfilUsuario />} />
                <Route path="/nivel-ganado" element={<NivelGanado />} />
                <Route path="/error" element={<Error />} />
                <Route path="/inicio" element={<InicioSesion />} />
                <Route path="/te-equivocaste" element={<TeEquivocaste />} />
                <Route path="/seleccion-nivel" element={<SeleccionNivel />} />
                <Route path="/explicacion" element={<VistaExplicacion />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}
