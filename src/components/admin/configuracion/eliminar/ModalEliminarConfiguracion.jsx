import { motion, AnimatePresence } from "framer-motion";

const ModalEliminarConfiguracion = ({ visible, onClose, config, onConfirmar }) => {
  if (!visible || !config) return null;

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
            width: "450px",
            borderRadius: "20px",
            textAlign: "center"
          }}
        >
          <h5 className="fw-bold mb-3">¿Eliminar configuración?</h5>
          <p>
            Estás a punto de eliminar la clave <strong>{config.clave}</strong>.
            <br />
            ¿Deseas continuar?
          </p>

          <div className="d-flex justify-content-end gap-2 mt-4">
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
              className="btn text-white"
              style={{ backgroundColor: "#ff5c00" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
              onClick={() => {
                onConfirmar(config.clave);
                onClose();
              }}
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEliminarConfiguracion;
