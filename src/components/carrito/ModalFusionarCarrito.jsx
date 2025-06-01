import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ModalFusionCarrito = ({ visible, onConfirmarMerge, onMantenerBD, onCancelar }) => {
  if (!visible) return null;
  console.log("SOY EL MODAL");
  

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          className="modal-content bg-white rounded shadow"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          style={{
            width: '100%',
            maxWidth: '450px',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)',
          }}
        >
          <h5 className="fw-bold mb-3">¿Qué quieres hacer con el carrito?</h5>
          <p className="text-secondary mb-4">
            Tienes productos en el carrito. ¿Quieres fusionarlos con los de tu cuenta o mantener solo el que ya está almacenado?
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button
              className="btn border-0 text-white"
              style={{ backgroundColor: "#ff5c00" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
              onClick={onConfirmarMerge}
            >
              Fusionar carritos
            </button>

            <button
              className="btn border-0 text-white"
              style={{ backgroundColor: "#ff5c00" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
              onClick={onMantenerBD}
            >
              Mantener el de mi cuenta
            </button>
          </div>

          <button
            className="btn btn-link mt-4 text-decoration-none"
            style={{ color: "black" }}
            onMouseEnter={(e) => (e.target.style.color = "#ff5c00")}
            onMouseLeave={(e) => (e.target.style.color = "black")}
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ModalFusionCarrito;
