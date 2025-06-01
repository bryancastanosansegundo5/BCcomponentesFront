import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
const ModalSinStock = ({ visible, onCerrar }) => {
    const navigate = useNavigate();
  if (!visible) return null;
  const manejarCerrar = () => {
    onCerrar();
    navigate("/cesta");
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
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          className="modal-content bg-white p-4 rounded"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          style={{
            width: "400px",
            borderRadius: "20px",
            textAlign: "center"
          }}
        >
          <h5 className="fw-bold mb-3 text-danger">Stock insuficiente</h5>
          <p className="mb-4">Uno o más productos de tu carrito no tienen suficiente stock para completar el pedido.</p>
          <button
            className="btn border-0 text-white"
            style={{ backgroundColor: "#ff5c00" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
            onClick={manejarCerrar}
          >
            Entendido
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalSinStock;
