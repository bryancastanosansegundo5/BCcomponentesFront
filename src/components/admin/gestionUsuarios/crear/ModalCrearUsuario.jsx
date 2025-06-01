import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiUserPlus } from "react-icons/bi";
import { crearUsuarioDesdeEmpleado } from "../../../../services/empleadoService";
import { obtenerRoles } from "../../../../services/rolService";
import { useAuth } from "../../../../context/AuthContext";

const ModalCrearUsuario = ({ visible, onClose, onCreado }) => {
  const { user, token } = useAuth();
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [rolId, setRolId] = useState(1);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      obtenerRoles()
        .then(setRoles)
        .catch(() => setRoles([]));
    } else {
      setNombre("");
      setApellidos("");
      setEmail("");
      setClave("");
      setRolId(1);
      setError("");
    }
  }, [visible]);

  const validar = () => {
    if (!email.trim()) return "El email es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "El email debe tener un formato válido.";
    if (!clave.trim()) return "La contraseña es obligatoria.";
    if (clave.length < 8)
      return "La contraseña debe tener al menos 8 caracteres.";
    return "";
  };

  const handleCrear = async () => {
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    try {
      const nuevoUsuario = { email, clave, nombre, apellidos, rolId };
      await crearUsuarioDesdeEmpleado(token,nuevoUsuario);
      onCreado();
      onClose();
    } catch (e) {
      setError(e.message || "❌ Error al crear el usuario.");
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          className="modal-content bg-white p-4 rounded"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          style={{ width: "500px", borderRadius: "20px" }}
        >
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <BiUserPlus size={22} />
            Crear nuevo usuario
          </h5>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña* (mín. 8 caracteres)"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre (opcional)"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Apellidos (opcional)"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </div>

          <div className="mb-3">
          <select
  className="form-select"
  value={rolId}
  onChange={(e) => setRolId(parseInt(e.target.value))}
>
  {roles
    .filter((rol) => user?.rolId === 3 || rol.id === 1) // admin ve todos, empleado solo CLIENTE (id = 1)
    .map((rol) => (
      <option key={rol.id} value={rol.id}>
        {rol.nombre}
      </option>
    ))}
</select>

          </div>

          {error && <small className="text-danger">{error}</small>}

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn text-white"
              style={{ backgroundColor: "#6c757d" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a6268")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c757d")}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="btn border-0 text-white"
              style={{ backgroundColor: "#ff5c00" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
              onClick={handleCrear}
            >
              Crear usuario
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalCrearUsuario;
