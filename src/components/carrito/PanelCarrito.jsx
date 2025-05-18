import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarritoStore } from "../../store/carritoStore";
import { useRecomendacionesStore } from "../../store/recomendacionesStore";
import { useChatCompatibilidadStore } from "../../store/chatCompatibilidadStore";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BiTrash } from "react-icons/bi";
import {
  cargarCarritoYProductos,
  manejarCompatibilidad,
} from "../../services/carritoService";
import { obtenerPorIds } from "../../services/productoService";
import RecomendacionProductos from "./Recomendacion/RecomendacionProductos";
import ChatCompatibilidad from "./Recomendacion/ChatCompatibilidad";
import FondoOscuro from "../generales/FondoOscuro";

const PanelCarrito = () => {
  const carrito = useCarritoStore((state) => state.carrito);
  const productos = useCarritoStore((state) => state.productos);
  const panelVisible = useCarritoStore((state) => state.panelVisible);
  const abrirChat = useChatCompatibilidadStore((state) => state.abrirChat);
  const historialChat = useChatCompatibilidadStore((state) => state.historial);
  const abrirRecomendaciones = useRecomendacionesStore((state) => state.abrir);
  const cerrarRecomendaciones = useRecomendacionesStore(
    (state) => state.cerrar
  );
  const historialMensajes = useChatCompatibilidadStore(
    (state) => state.historial
  );
  const limpiarHistorial = useChatCompatibilidadStore(
    (state) => state.limpiarHistorial
  );
  const visible = useRecomendacionesStore((state) => state.visible);

  const cerrarPanel = useCarritoStore((state) => state.cerrarPanel);
  const quitarProducto = useCarritoStore((state) => state.quitarProducto);
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  const eliminarProducto = useCarritoStore((state) => state.eliminarProducto);

  const productosRecomendados = useRecomendacionesStore(
    (state) => state.productosRecomendados
  );
  const setProductosRecomendados = useRecomendacionesStore(
    (state) => state.setProductosRecomendados
  );

  const [problemasRevision, setProblemasRevision] = useState([]);
  const [estadoRevision, setEstadoRevision] = useState([]);

  const { user } = useAuth();
  const ultimaConsulta = useRef(null);
  const ultimaRespuesta = useRef([]);

  const manejarClickCompatibilidad = async () => {
    try {
      const carritoActual = JSON.stringify(carrito);

      if (
        ultimaConsulta.current === carritoActual &&
        JSON.stringify(productosRecomendados) ===
          JSON.stringify(ultimaRespuesta.current)
      ) {
        abrirRecomendaciones();
        abrirChat();
        return;
      }

      const resultado = await manejarCompatibilidad(carrito);
      const productosSugeridos = await obtenerPorIds(resultado.sugerencias);

      setProblemasRevision(resultado.problemas);
      setEstadoRevision(resultado.estado);

      const mismosIds = (a, b) =>
        a.length === b.length && a.every((p, i) => p.id === b[i]?.id);

      if (!mismosIds(productosSugeridos, ultimaRespuesta.current)) {
        setProductosRecomendados(productosSugeridos);
        ultimaRespuesta.current = productosSugeridos;
      }

      ultimaConsulta.current = carritoActual;

      abrirRecomendaciones();
      abrirChat();
    } catch (error) {
      console.error("❌ Error comprobando compatibilidad:", error);
    }
  };

  const cerrarTodo = () => {
    cerrarRecomendaciones();
    cerrarPanel();
    // setProductosRecomendados([]);
    // if (historialChat.length > 0) limpiarHistorial();
  };

  useEffect(() => {
    document.body.style.overflow = panelVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [panelVisible]);

  useEffect(() => {
    if (panelVisible) {
      cargarCarritoYProductos(user?.id || null);
    }
  }, [panelVisible, user]);

  const totalUnidades = Object.values(carrito).reduce(
    (suma, cantidad) => suma + cantidad,
    0
  );

  const total = Object.entries(carrito).reduce((suma, [id, cantidad]) => {
    const producto = productos[String(id)];
    return suma + (producto?.precio || 0) * cantidad;
  }, 0);

  return (
    <AnimatePresence>
      {panelVisible && (
        <>
          <motion.div
            key="fondo-panel"
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarTodo}
            style={{ zIndex: 1038 }}
          />

          <motion.div
            className="position-fixed top-0 end-0 bg-white shadow-lg p-3"
            style={{
              width: "370px",
              height: "100vh",
              position: "relative",
              zIndex: 1041,
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Mi cesta</h5>
              <button className="btn btn-link text-dark" onClick={cerrarTodo}>
                ✕
              </button>
            </div>

            <div
              className="mb-3"
              style={{ maxHeight: "75vh", overflowY: "auto" }}
            >
              {Object.entries(carrito).length === 0 ? (
                <p>No hay productos en el carrito.</p>
              ) : (
                Object.entries(carrito).map(([id, cantidad]) => {
                  const producto = productos[String(id)];
                  if (!producto) return null;

                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.2 }}
                      className="d-flex gap-2 mb-3 border-bottom pb-2 align-items-center"
                    >
                      <img
                        src={`${producto.imagen}`}
                        alt={producto.descripcion}
                        width="64"
                        height="64"
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />

                      <div
                        className="flex-grow-1 d-flex flex-column justify-content-between"
                        style={{ minHeight: "64px" }}
                      >
                        <div
                          className="fw-medium "
                          style={{
                            maxWidth: "160px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {producto.nombre}
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <div className="fw-bold">
                            {producto.precio.toFixed(2)}€
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              style={{ transition: "all 0.3s ease" }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#ff5c00";
                                e.target.style.borderColor = "#ff5c00";
                                e.target.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "";
                                e.target.style.borderColor = "";
                                e.target.style.color = "";
                              }}
                              onClick={() => agregarProducto(id)}
                            >
                              +
                            </button>

                            <span>{cantidad}</span>

                            <button
                              className="btn btn-outline-secondary btn-sm"
                              style={{ transition: "all 0.3s ease" }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#ff5c00";
                                e.target.style.borderColor = "#ff5c00";
                                e.target.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "";
                                e.target.style.borderColor = "";
                                e.target.style.color = "";
                              }}
                              onClick={() => quitarProducto(id)}
                            >
                              -
                            </button>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-sm text-danger"
                              onClick={() => eliminarProducto(id)}
                            >
                              <BiTrash size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between">
                <span className="fw-medium">Unidades</span>
                <span>{totalUnidades}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total (IVA incluido)</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            {user ? (
              <>
                <div
                  className="text-center mb-2"
                  style={{
                    fontSize: "0.9rem",
                    color: "#6c757d",
                  }}
                >
                  ¿Tienes dudas sobre compatibilidad?
                </div>
                {historialChat.length > 0 ? (
                  <div className="d-flex flex-row gap-2 mb-3">
                    <button
                      className="btn w-100 fw-bold fs-6"
                      style={{
                        border: "2px solid #ff5c00",
                        backgroundColor: "white",
                        color: "#ff5c00",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#ff5c00";
                        e.target.style.color = "white";
                        e.target.style.borderColor = "#C74900";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#ff5c00";
                        e.target.style.borderColor = "#ff5c00";
                      }}
                      onClick={manejarClickCompatibilidad}
                    >
                      Comprobar
                    </button>

                    <button
                      className="btn w-100 fw-bold"
                      style={{
                        border: "2px solid #ff5c00",
                        backgroundColor: "white",
                        color: "#ff5c00",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#ff5c00";
                        e.target.style.color = "white";
                        e.target.style.borderColor = "#C74900";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#ff5c00";
                        e.target.style.borderColor = "#ff5c00";
                      }}
                      onClick={abrirChat}
                    >
                      Abrir chat
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn w-100 fw-bold mb-3"
                    style={{
                      border: "2px solid #ff5c00",
                      backgroundColor: "white",
                      color: "#ff5c00",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#ff5c00";
                      e.target.style.color = "white";
                      e.target.style.borderColor = "#C74900";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "#ff5c00";
                      e.target.style.borderColor = "#ff5c00";
                    }}
                    onClick={manejarClickCompatibilidad}
                  >
                    Comprobar compatibilidad
                  </button>
                )}

                <Link
                  to="/cesta"
                  className="btn w-100 fw-bold"
                  onClick={cerrarTodo}
                  style={{
                    backgroundColor: "#ff5c00",
                    borderColor: "#ff5c00",
                    color: "white",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#C74900";
                    e.target.style.borderColor = "#C74900";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ff5c00";
                    e.target.style.borderColor = "#ff5c00";
                  }}
                >
                  Ver artículos en tu cesta
                </Link>
              </>
            ) : (
              <Link
                to="/login?desde=carrito"
                className="btn w-100 fw-bold mt-3"
                style={{
                  backgroundColor: "#ff5c00",
                  borderColor: "#ff5c00",
                  color: "white",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#C74900";
                  e.target.style.borderColor = "#C74900";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ff5c00";
                  e.target.style.borderColor = "#ff5c00";
                }}
                onClick={cerrarTodo}
              >
                Iniciar sesión
              </Link>
            )}
          </motion.div>
        </>
      )}
      {visible && (
        <RecomendacionProductos
          key="popup-recomendaciones"
          problemasRevision={problemasRevision}
          estadoRevision={estadoRevision}
        />
      )}
      {panelVisible && <ChatCompatibilidad key="popup-chat" />}
      {/* <FondoOscuro
      key="fondo-oscuro"
  onClick={() => {
    cerrarRecomendaciones();
    cerrarChat(); // importa esto arriba si hace falta
  }}
/> */}
    </AnimatePresence>
  );
};

export default PanelCarrito;
