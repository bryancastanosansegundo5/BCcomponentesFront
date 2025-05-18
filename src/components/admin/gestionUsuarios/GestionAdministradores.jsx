import GestionUsuarios from "./GestionUsuarios";
import { obtenerAdministradores } from "../../../services/adminService";

const GestionAdministradores = () => {
  return (
    <GestionUsuarios
      titulo="Gestión de administradores"
      fetchUsuarios={(token) => obtenerAdministradores(token)}
      rolId={3}
    />
  );
};

export default GestionAdministradores;
