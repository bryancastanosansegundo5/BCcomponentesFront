import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ModalNuevaConfiguracion = ({ visible, onClose, onCrear }) => {
  const [clave, setClave] = useState("");
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");

  const handleCrear = () => {
    if (!clave.trim() || !valor.trim()) {
      setError("Debes completar ambos campos.");
      return;
    }
    setError("");
    onCrear(clave.trim(), valor.trim());
    onClose();
    setClave("");
    setValor("");
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
          alignItems: "center"
        }}
      >
        <motion.div
          className="modal-content bg-white p-4 rounded"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          style={{
            width: "500px",
            borderRadius: "20px"
          }}
        >
          <h5 className="fw-bold mb-3">Nueva configuración</h5>

          <div className="mb-3">
            <label className="form-label">Clave</label>
            <input
              className="form-control"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              style={{ borderRadius: "10px" }}
              placeholder="Ej: nombre_tienda"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Valor</label>
            <input
              className="form-control"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              style={{ borderRadius: "10px" }}
              placeholder="Ej: Tienda Bryan"
            />
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
              onClick={handleCrear}
            >
              Crear configuración
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalNuevaConfiguracion;
