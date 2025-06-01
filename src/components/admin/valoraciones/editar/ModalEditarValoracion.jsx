import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cambiarVisibilidadValoracion } from "../../../../services/adminService";
import { useAuth } from "../../../../context/AuthContext";


const ModalEditarValoracion = ({ visible, valoracion, onClose, onActualizado }) => {
    const user = useAuth()
    const [visibleComentario, setVisibleComentario] = useState(valoracion.visible);
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const { id, producto, comentario, puntuacion, imagenProducto, emailUsuario } = valoracion;

    const handleGuardar = async () => {
        try {
            await cambiarVisibilidadValoracion(user.token, id, visibleComentario);
            setMensajeExito("Visibilidad actualizada");
            onActualizado();
            onClose();
        } catch (error) {
            setMensajeError("Error al actualizar visibilidad");
            setTimeout(() => setMensajeError(""), 3000);
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
                        className="modal-content bg-white p-4 rounded shadow"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        style={{
                            width: "600px",
                            maxWidth: "95vw",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            borderRadius: "15px",
                            zIndex: 10000,
                        }}
                    >
                        <div className="modal-header d-flex align-items-start mb-4">
                            <h5 className="modal-title fw-bold flex-grow-1">
                                Comentario de <span style={{ color: "#ff5c00" }}>{emailUsuario}</span>
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>


                        <div className="modal-body">
                            {mensajeError && <p className="text-danger mb-4">{mensajeError}</p>}
                            {mensajeExito && <p className="text-success mb-4">{mensajeExito}</p>}

                            <div className="d-flex flex-wrap gap-4">
                                <img
                                    src={imagenProducto}
                                    alt={producto}
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "contain",
                                        flexShrink: 0,
                                    }}
                                />
                                <div className="flex-grow-1">
                                    <p className="mb-4"><strong>Producto:</strong> {producto}</p>
                                    <p className="mb-4">
                                        <strong>Fecha de publicación:</strong>{" "}
                                        {new Date(valoracion.fecha).toLocaleTimeString("es-ES", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}{" "}
                                        {new Date(valoracion.fecha).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </p>



                                    <p className="mb-4"><strong>Puntuación:</strong> {puntuacion}</p>
                                    <p className="mb-1"><strong>Comentario:</strong></p>
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        value={comentario}
                                        disabled
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    />
                                    <div className="form-check form-switch mb-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            checked={visibleComentario}
                                            onChange={(e) => setVisibleComentario(e.target.checked)}
                                            id="visibleSwitch"
                                        />
                                        <label className="form-check-label ms-2" htmlFor="visibleSwitch">
                                            Comentario visible
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer d-flex justify-content-end gap-3 pt-4">
                            <button className="btn btn-secondary px-4" onClick={onClose}>
                                Cancelar
                            </button>
                            <button
                                className="btn text-white px-4"
                                style={{ backgroundColor: "#ff5c00" }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
                                onClick={handleGuardar}
                            >
                                Guardar cambios
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalEditarValoracion;
