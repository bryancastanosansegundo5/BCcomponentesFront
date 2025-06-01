import GestionUsuarios from "./GestionUsuarios";
import { obtenerEmpleados } from "../../../services/adminService";

const GestionEmpleados = () => (
  <GestionUsuarios
    titulo="Gestión de empleados"
    fetchUsuarios={(token) => obtenerEmpleados(token)}
    rolId={2}

  />
);

export default GestionEmpleados;
