import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { provincias } from "../../../../utils/configuracionUI";
import Flag from "react-world-flags";
const ModalEditarUsuario = ({
  visible,
  onClose,
  usuario,
  onGuardar,
  rolUsuarioLogueado,
  rolesDisponibles = [],
}) => {
  const [form, setForm] = useState({});
  const [confirmando, setConfirmando] = useState(false);
  const [errorClave, setErrorClave] = useState("");
  useEffect(() => {
    if (usuario) {
      setForm({ ...usuario, nuevaClave: "", repetirClave: "" });
    }
  }, [usuario]);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGuardar = () => {
    if (form.nuevaClave || form.repetirClave) {
      if (form.nuevaClave !== form.repetirClave) {
        setErrorClave("Las contraseñas no coinciden");
        return;
      }
    }
    setErrorClave("");
    setConfirmando(true);
  };

  const confirmarEdicion = () => {
    setConfirmando(false);
    onGuardar(form);
    onClose();
  };
  
  
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
          backgroundColor: confirmando ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.5)",
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
          style={{
            width: "600px",
            borderRadius: "20px",
            filter: confirmando ? "brightness(0.6)" : "none",
            pointerEvents: confirmando ? "none" : "auto",
          }}
        >
          <h5 className="fw-bold mb-4">Editar usuario</h5>

<div className="row">
  <div className="col-md-6 pe-md-3">
    <div className="mb-3">
      <label className="form-label">Nombre</label>
      <input
        name="nombre"
        className="form-control"
        value={form.nombre || ""}
        onChange={handleChange}
        placeholder="Ej. Laura"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">País</label>
      <select
        name="pais"
        className="form-select"
        value={form.pais || ""}
        onChange={handleChange}
      >
        <option value="">Selecciona un país</option>
        <option value="España">España</option>
        <option value="Andorra">Andorra</option>
        <option value="Portugal">Portugal</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">Dirección y número</label>
      <input
        name="direccion"
        className="form-control"
        value={form.direccion || ""}
        onChange={handleChange}
        placeholder="Ej. Calle de Cavanilles, 35"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Código postal</label>
      <input
        name="codigoPostal"
        className="form-control"
        value={form.codigoPostal || ""}
        onChange={handleChange}
        placeholder="Ej. 28007"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Provincia</label>
      <select
        name="provincia"
        className="form-select"
        value={form.provincia || ""}
        onChange={handleChange}
      >
        <option value="">Selecciona una provincia</option>
        {provincias.map((prov, i) => (
          <option key={i} value={prov}>{prov}</option>
        ))}
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">Rol</label>
      <select
        className="form-select"
        name="id_rol"
        value={form.rol?.id || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            rol: { ...prev.rol, id: parseInt(e.target.value) },
          }))
        }
      >
        <option value="" disabled>Selecciona un rol</option>
        {rolesDisponibles
          .filter((rol) => rolUsuarioLogueado === 3 || rol.id === 1)
          .map((rol) => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
      </select>
    </div>
  </div>

  <div className="col-md-6 ps-md-3">
    <div className="mb-3">
      <label className="form-label">Apellidos</label>
      <input
        name="apellidos"
        className="form-control"
        value={form.apellidos || ""}
        onChange={handleChange}
        placeholder="Ej. García López"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Teléfono</label>
      <div className="d-flex">
        <span className="input-group-text" style={{ backgroundColor: "#ccc" }}>
          <Flag code="ES" style={{ width: 20 }} /> +34
        </span>
        <input
          name="telefono"
          type="tel"
          className="form-control border-start-0 rounded-start-0"
          value={form.telefono || ""}
          onChange={handleChange}
          placeholder="Ej. 612345678"
        />
      </div>
    </div>
    <div className="mb-3">
      <label className="form-label">Datos adicionales</label>
      <input
        name="adicionales"
        className="form-control"
        value={form.adicionales || ""}
        onChange={handleChange}
        placeholder="Piso, puerta, etc."
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Población</label>
      <input
        name="poblacion"
        className="form-control"
        value={form.poblacion || ""}
        onChange={handleChange}
        placeholder="Ej. Madrid"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Nueva contraseña</label>
      <input
        name="nuevaClave"
        type="password"
        className="form-control"
        value={form.nuevaClave || ""}
        onChange={handleChange}
        placeholder="Introduce nueva contraseña"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Repetir contraseña</label>
      <input
        name="repetirClave"
        type="password"
        className="form-control"
        value={form.repetirClave || ""}
        onChange={handleChange}
        placeholder="Repite la nueva contraseña"
      />
      {errorClave && <small className="text-danger">{errorClave}</small>}
    </div>
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        id="baja"
        name="baja"
        checked={form.baja || false}
        onChange={handleChange}
      />
      <label className="form-check-label w-100 text-start" htmlFor="baja">
        Usuario dado de baja
      </label>
    </div>
  </div>
</div>



          <div className="d-flex justify-content-end gap-2">
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
              onClick={handleGuardar}
            >
              Guardar cambios
            </button>
          </div>
        </motion.div>

        {confirmando && (
          <motion.div
            className="modal-content bg-white p-3 rounded shadow"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: "300px",
              textAlign: "center",
              borderRadius: "15px",
              zIndex: 10000,
            }}
          >
            <p className="fw-bold">¿Deseas guardar los cambios?</p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light"
                onClick={() => setConfirmando(false)}
              >
                Cancelar
              </button>
              <button
                className="btn text-white"
                style={{ backgroundColor: "#ff5c00" }}
                onClick={confirmarEdicion}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEditarUsuario;
