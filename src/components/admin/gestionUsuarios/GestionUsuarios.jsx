import { useEffect, useState, useRef } from "react";
import { BiPencil, BiPlus } from "react-icons/bi";
import { useAuth } from "../../../context/AuthContext";
import {
  buscarUsuarios,
  actualizarUsuarioDesdeEmpleado,
} from "../../../services/empleadoService";
import { obtenerRoles } from "../../../services/rolService";
import { camposBusqueda } from "../../../utils/configuracionUI";
import ModalEditarUsuario from "./editar/ModalEditarUsuario";
import ModalCrearUsuario from "./crear/ModalCrearUsuario"; // <-- asegúrate de tener este modal

const GestionUsuarios = ({ titulo, fetchUsuarios, rolId }) => {

  const { user: usuarioAutenticado,token } = useAuth();
  if (!token) return null;

  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  

  const [campoSeleccionado, setCampoSeleccionado] = useState("nombre");
  const [valorBusqueda, setValorBusqueda] = useState("");

  const scrollRef = useRef(null);

  const cargarUsuarios = async () => {
    if (!usuarioAutenticado?.id) return;
    try {
      const usuarios = !valorBusqueda
  ? await fetchUsuarios(token)
  : await buscarUsuarios(
      token,
      campoSeleccionado,
      valorBusqueda,
      rolId 
    );


      setListaUsuarios(usuarios);
    } catch {
      setMensajeError("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [usuarioAutenticado, campoSeleccionado, valorBusqueda, fetchUsuarios]);

  useEffect(() => {
    obtenerRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  const handleGuardarUsuario = async (datosActualizados) => {
    try {
      await actualizarUsuarioDesdeEmpleado(
        token,
        datosActualizados.id,
        datosActualizados
      );
      setMensajeExito("✅ Usuario actualizado correctamente");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeExito(""), 3000);
      setValorBusqueda("");
      await cargarUsuarios();
    } catch (err) {
      setMensajeError("Hubo un error inesperado");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1400px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">{titulo}</h4>

      <div ref={scrollRef} className="mb-3">
        {mensajeError && <p className="text-danger fw-semibold">{mensajeError}</p>}
        {mensajeExito && <p className="text-success fw-semibold">{mensajeExito}</p>}
      </div>

      <div className="d-flex justify-content-between flex-wrap gap-3 mb-3 align-items-center">
        <div className="d-flex align-items-center gap-3">
          <select
            className="form-select"
            style={{ width: "160px", borderRadius: "10px" }}
            value={campoSeleccionado}
            onChange={(e) => {
              setCampoSeleccionado(e.target.value);
              setValorBusqueda("");
            }}
          >
            {camposBusqueda.map((campo) => (
              <option key={campo.value} value={campo.value}>
                {campo.label}
              </option>
            ))}
          </select>

          {campoSeleccionado === "baja" ? (
            <select
              className="form-select"
              style={{ width: "160px", borderRadius: "10px" }}
              value={valorBusqueda}
              onChange={(e) => setValorBusqueda(e.target.value)}
            >
              <option value="">-- Estado --</option>
              <option value="true">Baja</option>
              <option value="false">Activo</option>
            </select>
          ) : (
            <input
              type="text"
              className="form-control"
              placeholder="Buscar..."
              style={{ width: "400px", borderRadius: "10px" }}
              value={valorBusqueda}
              onChange={(e) => setValorBusqueda(e.target.value)}
            />
          )}
        </div>

        <button
          className="btn border-0 text-white d-flex align-items-center gap-1 shadow-sm"
          style={{
            backgroundColor: "#ff5c00",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
          onClick={() => setModalCrearVisible(true)}
        >
          <BiPlus size={18} />
          Nuevo usuario
        </button>
      </div>

      {listaUsuarios.length === 0 ? (
        <p className="text-muted">No hay resultados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Provincia</th>
                <th>Estado</th>
                <th>Pedidos</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="text-muted">{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellidos}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.provincia}</td>
                  <td>
                    <span
                      className={`badge ${
                        usuario.baja ? "bg-secondary" : "bg-success"
                      }`}
                    >
                      {usuario.baja ? "Baja" : "Activo"}
                    </span>
                  </td>
                  <td>{usuario.pedidos}</td>
                  <td className="text-center">
                    <button
                      className="btn text-white shadow-sm"
                      style={{
                        backgroundColor: "#ff5c00",
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#C74900")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#ff5c00")
                      }
                      onClick={() => setUsuarioEditando(usuario)}
                      title="Editar usuario"
                    >
                      <BiPencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

<ModalEditarUsuario
  visible={!!usuarioEditando}
  usuario={usuarioEditando}
  onClose={() => setUsuarioEditando(null)}
  onGuardar={handleGuardarUsuario}
  rolesDisponibles={roles}
  rolUsuarioLogueado={usuarioAutenticado.rolId}
/>


      <ModalCrearUsuario
        visible={modalCrearVisible}
        onClose={() => setModalCrearVisible(false)}
        onCreado={async () => {
          setMensajeExito("✅ Usuario creado correctamente");
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => setMensajeExito(""), 3000);
          await cargarUsuarios();
        }}
      />
    </div>
  );
};

export default GestionUsuarios;
