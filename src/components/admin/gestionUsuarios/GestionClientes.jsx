import GestionUsuarios from "./GestionUsuarios";
import { obtenerUsuarios } from "../../../services/empleadoService";

const GestionClientes = () => (
  <GestionUsuarios
    titulo="Gestión de clientes"
    fetchUsuarios={(token) => obtenerUsuarios(token)}
    rolId={1} // clientes

  />
);

export default GestionClientes;
