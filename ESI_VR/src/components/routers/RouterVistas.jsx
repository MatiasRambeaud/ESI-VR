import RouterBase from "./RouterBase"; 
import PerfilUsuario from "../views/PerfilUsuario";
import NivelGanado from "../views/NivelGanado";
import Error from "../views/Error";
import InicioSesion from "../views/InicioSesion";
import TeEquivocaste from "../views/TeEquivocaste";
import SeleccionNivel from "../views/SeleccionNivel";
import VistaExplicacion from "../views/vistaexplicacion";
import Mensajecamara from "../views/mensajecamara";

export default class RouterVistas extends RouterBase {
  init() {
    return (
      <>
        {this.get("/perfil", <PerfilUsuario />)}
        {this.get("/nivel-ganado", <NivelGanado />)}
        {this.get("/error", <Error />)}
        {this.get("/mensaje-camara", <Mensajecamara />)}
        {this.get("/inicio", <InicioSesion />)}
        {this.get("/te-equivocaste", <TeEquivocaste />)}
        {this.get("/seleccion-nivel", <SeleccionNivel />)}
        {this.get("/explicacion", <VistaExplicacion />)}
        {this.get("*", <Error />)}
      </>
    );
  }
}
