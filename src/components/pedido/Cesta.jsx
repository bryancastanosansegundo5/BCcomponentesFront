import { useCarritoStore } from "../../store/carritoStore";
import { useNavigate } from "react-router-dom";
import BarraProgresoPedido from "./BarraProgresoPedido";
import ModalVaciarCesta from "./ModalVaciarCesta";
import ResumenPedido from "./ResumenPedido";
import { BiTrash, BiHeadphone } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useRecomendacionesStore } from "../../store/recomendacionesStore";
import { useChatCompatibilidadStore } from "../../store/chatCompatibilidadStore";
import { obtenerProductoPorId } from "../../services/productoService";
import ChatCompatibilidad from "../carrito/Recomendacion/ChatCompatibilidad";
import FondoOscuro from "../generales/FondoOscuro";
import DetalleProducto from "../catalogo/DetalleProducto";

const Cesta = () => {
  const carrito = useCarritoStore((state) => state.carrito);
  const productos = useCarritoStore((state) => state.productos);
  const setProductos = useCarritoStore((state) => state.setProductos);
  const quitarProducto = useCarritoStore((state) => state.quitarProducto);
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  const eliminarProducto = useCarritoStore((state) => state.eliminarProducto);
  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);
  const chatVisible = useChatCompatibilidadStore((state) => state.chatVisible);
  const abrirChat = useChatCompatibilidadStore((state) => state.abrirChat);
  const cerrarChat = useChatCompatibilidadStore((state) => state.cerrarChat);
  const historialChat = useChatCompatibilidadStore((state) => state.historial);

  const cerrarRecomendaciones = useRecomendacionesStore(
    (state) => state.cerrar
  );
  const visible = useRecomendacionesStore((state) => state.visible);
  const productosRecomendados = useRecomendacionesStore(
    (state) => state.productosRecomendados
  );
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);

  const totalUnidades = Object.values(carrito).reduce(
    (suma, cantidad) => suma + cantidad,
    0
  );
  useEffect(() => {
    const cargarProductosFaltantesDelCarrito = async () => {
      const productosEnStore = useCarritoStore.getState().productos;

      const idsDeProductosIncompletos = Object.keys(carrito).filter((id) => {
        const producto = productosEnStore[id];
        return (
          !producto || !producto.nombre || !producto.precio || !producto.imagen
        );
      });

      if (idsDeProductosIncompletos.length === 0) return;

      const productosCargados = await Promise.all(
        idsDeProductosIncompletos.map((id) => obtenerProductoPorId(id))
      );

      setProductos(productosCargados);
    };

    cargarProductosFaltantesDelCarrito();
  }, [carrito]);

  return (
    <>
      <BarraProgresoPedido
        pasoActivo={pasoActual}
        onPasoClick={(nuevoPaso) => setPasoActual(nuevoPaso)}
      />

      <div className="container my-4">
        <div className="mb-4 text-start">
          {/* Mostrar productos recomendados debajo de la lista si ya se cerró el panel lateral */}
          {!visible && productosRecomendados.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Productos recomendados</h5>
              <div className="d-flex flex-wrap gap-3">
                {productosRecomendados.map((producto) => (
                  <div
                    key={producto.id}
                    className="border rounded p-2 text-center"
                    style={{ width: "140px" }}
                    onClick={() => setProductoSeleccionado(producto.id)}
                  >
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="img-fluid mb-2"
                      style={{ height: "80px", objectFit: "cover" }}
                    />
                    <div className="fw-bold small">{producto.nombre}</div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {producto.precio.toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              className="d-flex"
              style={{
                justifyContent: "end",
                flexDirection: "column",
              }}
            >
              <h3 className="fw-bold mb-3">Mi cesta</h3>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                {totalUnidades === 1
                  ? "1 artículo"
                  : `${totalUnidades} artículos`}
              </p>
            </div>

            <div
              style={{
                width: "80%",
              }}
            ></div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {Object.keys(carrito).length === 0 ? (
              <div className="text-center py-5">
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#f2f2f2",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "#888",
                  }}
                >
                  ❌
                </div>
                <h5 className="mt-3 fw-bold">Tu cesta está vacía</h5>
                <p className="text-muted">
                  Explora multitud de artículos a buen precio desde nuestra
                  página principal
                </p>
                <button
                  className="btn btn-warning fw-bold"
                  style={{
                    backgroundColor: "#ff5c00",
                    borderColor: "#ff5c00",
                    color: "#fff",
                  }}
                  onClick={() => navigate("/")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#C74900";
                    e.target.style.borderColor = "#C74900";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ff5c00";
                    e.target.style.borderColor = "#ff5c00";
                  }}
                >
                  Explorar artículos
                </button>
              </div>
            ) : (
              <>
                {Object.entries(carrito).map(([id, cantidad]) => {
                  const producto = productos[id];

                  return (
                    <div
                      key={id}
                      className="border rounded p-3 mb-3 d-flex align-items-center"
                    >
                      <img
                        src={producto?.imagen || "/img/cargando.png"}
                        alt={producto?.nombre || "No cargado"}
                        width="100"
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1">
                          {producto?.nombre || `Producto #${id}`}
                        </h5>
                        <div className="text-bold fw-bold fs-5">
                          {producto?.precio
                            ? `${producto.precio.toFixed(2)}€`
                            : "Cargando precio..."}
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => agregarProducto(id)}
                          style={{
                            border: "2px solid #00be00",
                            backgroundColor: "white",
                            color: "#00be00",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#ff5c00";
                            e.target.style.color = "white";
                            e.target.style.borderColor = "#C74900";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "white";
                            e.target.style.color = "#00be00";
                            e.target.style.borderColor = "#00be00";
                          }}
                        >
                          +
                        </button>
                        <span>{cantidad}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm ms-2"
                          onClick={() => quitarProducto(id)}
                          style={{
                            border: "2px solid #be0000",
                            backgroundColor: "white",
                            color: "#be0000",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#ff5c00";
                            e.target.style.color = "white";
                            e.target.style.borderColor = "#C74900";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "white";
                            e.target.style.color = "#be0000";
                            e.target.style.borderColor = "#be0000";
                          }}
                        >
                          -
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm ms-3"
                          onClick={() => eliminarProducto(id)}
                        >
                          <BiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setMostrarModal(true)}
                  >
                    Vaciar cesta
                  </button>
                  <button
                    className="btn btn-outline-dark"
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
                    onClick={() => navigate("/")}
                  >
                    Seguir comprando
                  </button>
                </div>
              </>
            )}

            <ModalVaciarCesta
              visible={mostrarModal}
              onCancelar={() => setMostrarModal(false)}
              onConfirmar={() => {
                vaciarCarrito();
                setMostrarModal(false);
              }}
            />
          </div>

          <div className="col-lg-4">
            <div
              className="text-center mb-3"
              style={{ fontSize: "0.9rem", color: "#6c757d" }}
            >
              ¿Tienes dudas sobre compatibilidad?
            </div>

            <ResumenPedido
              textoBoton="Guardar y continuar"
              onContinuar={() => navigate("/formularioDireccion")}
              mostrarBoton={totalUnidades !== 0}
            />
          </div>
        </div>
      </div>

      <FondoOscuro
        onClick={() => {
          cerrarRecomendaciones();
          cerrarChat();
        }}
      />

      {productoSeleccionado && (
        <DetalleProducto
          idProducto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          modoCompacto={false}
          key="popup-recomendaciones"
        />
      )}

      {chatVisible && <ChatCompatibilidad key="popup-chat" />}

      {/* Boton sticky para reabrir chat */}
      {!chatVisible && historialChat.length > 0 && (
        <button
          className="position-fixed bottom-0 end-0 m-4 btn btn-light shadow"
          style={{
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            zIndex: 1045,
            border: "2px solid #ff5c00",
          }}
          onClick={abrirChat}
        >
          <BiHeadphone size={28} color="#ff5c00" />
        </button>
      )}
    </>
  );
};

export default Cesta;
