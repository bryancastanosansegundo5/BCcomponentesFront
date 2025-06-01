import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarritoStore } from "../../../store/carritoStore";
import { useChatCompatibilidadStore } from "../../../store/chatCompatibilidadStore";
import { useRecomendacionesStore } from "../../../store/recomendacionesStore";
import { enviarPreguntaChat } from "../../../services/carritoService";
import { obtenerPorIds } from "../../../services/productoService";

const ChatCompatibilidad = () => {
  const chatVisible = useChatCompatibilidadStore((s) => s.chatVisible);
  const cerrarChat = useChatCompatibilidadStore((s) => s.cerrarChat);
  const historialMensajes = useChatCompatibilidadStore((s) => s.historial);
  const agregarMensaje = useChatCompatibilidadStore((s) => s.agregarMensaje);

  const productosRecomendados = useRecomendacionesStore(
    (state) => state.productosRecomendados
  );
  const agregarProductos = useRecomendacionesStore((s) => s.agregarProductos);
  const quitarProductos = useRecomendacionesStore((s) => s.quitarProductos);

  const [mensajeInput, setMensajeInput] = useState("");

  const enviarMensajeUsuario = async () => {
    if (!mensajeInput.trim() || productosRecomendados.length === 0) return;

    const nuevoMensajeUsuario = { autor: "usuario", texto: mensajeInput };
    agregarMensaje(nuevoMensajeUsuario);
    setMensajeInput("");

    try {
      const data = await enviarPreguntaChat(
        mensajeInput,
        productosRecomendados.map((p) => p.id)
      );

      const nuevoMensajeIA = { autor: "ia", texto: data.respuesta };
      agregarMensaje(nuevoMensajeIA);

      if (data.productos_agregar?.length > 0) {
        const nuevosProductos = await obtenerPorIds(data.productos_agregar);
        agregarProductos(nuevosProductos);
      }
      if (data.productos_quitar?.length > 0) {
        quitarProductos(data.productos_quitar);
      }
    } catch (error) {
      console.error("❌ Error enviando mensaje al chat:", error);
      agregarMensaje({ autor: "ia", texto: "❌ Hubo un error procesando tu consulta." });
    }
  };

  return (
    <AnimatePresence>
      {chatVisible && (
        <motion.div
          key="chat-panel"
          className="position-fixed top-0 end-0 p-3 d-flex flex-column"
          style={{
            width: "370px",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
            zIndex: 1042,
          }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold">Asistente de compatibilidad</h5>
            <button
              className="btn border-0"
              style={{ fontSize: "1.5rem", color: "#ff5c00" }}
              onClick={cerrarChat}
            >
              ✕
            </button>
          </div>

          <div
            className="flex-grow-1 mb-3"
            style={{
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderRadius: "10px",
              boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
            }}
          >
            {historialMensajes.length === 0 ? (
              <div className="text-center text-muted mt-5">
                ¡Hazme una pregunta!
              </div>
            ) : (
              historialMensajes.map((m, i) => (
                <div
                  key={i}
                  className="p-2 mb-2"
                  style={{
                    maxWidth: "80%",
                    marginLeft: m.autor === "usuario" ? "auto" : "0",
                    backgroundColor: "white",
                    color: m.autor === "usuario" ? "black" : "#ff5c00",
                    borderRadius: "12px",
                    textAlign: m.autor === "usuario" ? "right" : "left",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {m.texto}
                </div>
              ))
            )}
          </div>

          <div className="d-flex mt-2">
            <input
              className="form-control me-2"
              style={{ borderRadius: "10px" }}
              value={mensajeInput}
              onChange={(e) => setMensajeInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              onKeyDown={(e) => e.key === "Enter" && enviarMensajeUsuario()}
            />
            <button
              className="btn text-white fw-bold"
              style={{
                backgroundColor: "#ff5c00",
                borderColor: "#ff5c00",
                borderRadius: "10px",
              }}
              onClick={enviarMensajeUsuario}
            >
              Enviar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatCompatibilidad;
