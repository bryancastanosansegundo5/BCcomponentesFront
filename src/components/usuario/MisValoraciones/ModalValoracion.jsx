import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdStar } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";

const ModalValoracion = ({
  visible,
  onClose,
  onSubmit,
  detalleId,
  usuarioId,
}) => {
  const [comentario, setComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) {
      setComentario("");
      setPuntuacion(0);
      setError("");
    }
  }, [visible]);

  const validar = () => {
    if (puntuacion < 1 || puntuacion > 5)
      return "Debes seleccionar entre 1 y 5 estrellas";
    if (!comentario.trim()) return "El comentario es obligatorio";
    return "";
  };

  const handleEnviar = async () => {
    if (comentario.length > 500) {
      return;
    }
    const err = validar();
    if (err) return setError(err);

    try {
      await onSubmit({
        detalleId,
        usuarioId,
        puntuacion,
        comentario,
        visible: true,
      });
      onClose();
    } catch (e) {
      console.log(e.message );
    }
  };

  return (
    <AnimatePresence>
      {visible && (
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
            style={{
              width: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
            }}
          >
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <MdStar size={22} /> Valorar producto
            </h5>

            {/* Selector de estrellas */}
            <div className="mb-3 d-flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <MdStar
                  key={n}
                  size={30}
                  style={{ cursor: "pointer" }}
                  color={n <= puntuacion ? "#ff5c00" : "#ccc"}
                  onClick={() => setPuntuacion(n)}
                />
              ))}
            </div>

            {/* Área de comentario */}
            <div className="mb-3">
              <label htmlFor="comentario" className="form-label">
                Comentario *
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={500}
                className="form-control"
                placeholder="Escribe tu valoración (máx. 500 caracteres)"
                rows={4}
              />

              {comentario.length > 500 && (
                <p className="text-danger mt-1">Máximo 500 caracteres.</p>
              )}
            </div>

            {error && <small className="text-danger">{error}</small>}

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn text-white"
                style={{ backgroundColor: "#6c757d" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#5a6268")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#6c757d")
                }
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="btn border-0 text-white"
                style={{ backgroundColor: "#ff5c00" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#C74900")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ff5c00")
                }
                onClick={handleEnviar}
                disabled={comentario.length > 500}
              >
                Enviar valoración
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalValoracion;
