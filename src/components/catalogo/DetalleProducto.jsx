import { useEffect, useState, useRef } from "react";
import { obtenerProductoPorId } from "../../services/productoService";
import { guardarProductoEnHistorial } from "../../utils/guardarProductoEnHistorial";
import { useAuth } from "../../context/AuthContext";
import { useCarritoStore } from "../../store/carritoStore";
import Cookies from "js-cookie";
import Recomendaciones from "./Recomendaciones";
import "../../styles/detalleProducto.css";
import EstrellasValoracion from "../valoracion/EstrellasValoracion";
import ComentariosProducto from "../valoracion/ComentariosProducto";

const DetalleProducto = ({ idProducto, onClose, modoCompacto = false }) => {
  const { user } = useAuth();
  const [idActual, setIdActual] = useState(idProducto);
  const [producto, setProducto] = useState(null);
  const modalRef = useRef(null);

  const carrito = useCarritoStore((state) => state.carrito);
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  const productos = useCarritoStore((state) => state.productos);
  const setProductos = useCarritoStore((state) => state.setProductos);

  const quitarDelCarrito = useCarritoStore((state) => state.quitarProducto);
  const cantidad = carrito[idActual] || 0;

  // Scroll interno del modal al top
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [idActual]);

  const handleAgregar = () => {
    agregarProducto(idActual);

    if (!productos[idActual] && producto) {
      setProductos([producto]);
    }
  };

  // Carga de producto
  useEffect(() => {
    if (!idActual) return;
    const cargarProducto = async () => {
      try {
        const data = await obtenerProductoPorId(idActual);
        setProducto(data);
      } catch (err) {
        console.error("❌ Error al cargar el producto:", err);
      }
    };
    cargarProducto();
  }, [idActual]);

  // Historial de navegación
  useEffect(() => {
    if (producto?.id && user?.id) {
      guardarProductoEnHistorial(producto.id, user.id);
      const historial = Cookies.get(`historial_${user.id}`) || "[]";
      console.log("📦 Historial:", JSON.parse(historial));
    }
  }, [producto?.id, user?.id]);

  // Bloquear scroll del fondo
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  if (!producto) return null;

  return (
    <div
      className={`modal-backdrop ${modoCompacto ? "modal-backdrop-compacto" : "modal-backdrop-normal"
        }`}
      onClick={onClose}
    >
      <div
        className={`modal-dialog modal-xl ${modoCompacto ? "modal-dialog-compacto" : "modal-dialog-normal"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={modalRef}
          className="modal-content p-4"
          style={{
            overflowY: "auto",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "transparent",
            }}
          >
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
                fontSize: "1.8rem",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "0 12px",
                color: "#ff5c00",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#ff5c00";
                e.target.style.color = "white";
                e.target.style.borderRadius = "6px";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff5c00";
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            {/* Imagen */}
            <div
              style={{
                flex: "1 1 40%",
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: "10px",
                textAlign: "center",
                maxHeight: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: "1 1 60%", overflowY: "auto" }}>
              <h2 className="fw-bold mb-3">{producto.nombre}</h2>
              <div className="d-flex mb-2" style={{ width: "100%" }}>
                {/* Precio - 50% */}
                <div style={{ width: "50%" }}>
                  <span className="fs-4 fw-semibold text-success">{producto.precio} €</span>
                </div>

                {/* Estrellas - 50%, alineadas a la izquierda */}
                <div
                  className="text-start"
                  style={{
                    width: "50%",
                    fontSize: "1.4rem",
                    color: "#ff5c00",
                    whiteSpace: "nowrap",
                  }}
                >
                  <EstrellasValoracion
                    media={producto.valoracionMedia}
                    total={producto.totalValoraciones || 0}
                  />
                </div>
              </div>



              <p className="text-muted">{producto.descripcion}</p>
              {producto.socket && (
                <p>
                  <strong>Socket:</strong> {producto.socket}
                </p>
              )}
              {producto.tipoRam && (
                <p>
                  <strong>RAM:</strong> {producto.tipoRam}
                </p>
              )}
              {producto.pcie && (
                <p>
                  <strong>PCIe:</strong> {producto.pcie}
                </p>
              )}
              {producto.factorForma && (
                <p>
                  <strong>Factor forma:</strong> {producto.factorForma}
                </p>
              )}
              {producto.potenciaW && (
                <p>
                  <strong>Potencia:</strong> {producto.potenciaW}W
                </p>
              )}
              {producto.consumo && (
                <p>
                  <strong>Consumo:</strong> {producto.consumo}W
                </p>
              )}

              <div className="d-flex justify-content-start align-items-center gap-3 mt-4 mb-3">
                <button
                  className="btn rounded-circle px-3 py-1"
                  style={{
                    border: "2px solid #dc3545",
                    color: "#dc3545",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ff5c00";
                    e.target.style.color = "white";
                    e.target.style.border = "2px solid #ff5c00";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#dc3545";
                    e.target.style.border = "2px solid #dc3545";
                  }}
                  onClick={() => quitarDelCarrito(producto.id)}
                >
                  –
                </button>

                <span
                  className="badge bg-light text-dark fs-6 px-3 py-2"
                  style={{
                    borderRadius: "10px",
                    boxShadow:
                      cantidad > 0 ? "0 0 10px 3px rgba(255, 92, 0, 0.5)" : "",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {cantidad}
                </span>

                <button
                  className="btn rounded-circle px-3 py-1"
                  style={{
                    border: "2px solid #28a745",
                    color: "#28a745",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ff5c00";
                    e.target.style.color = "white";
                    e.target.style.border = "2px solid #ff5c00";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#28a745";
                    e.target.style.border = "2px solid #28a745";
                  }}
                  onClick={handleAgregar}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <Recomendaciones
            usuarioId={user?.id}
            onProductoClick={(nuevoId) => setIdActual(nuevoId)}
          />
          <ComentariosProducto productoId={producto.id} />
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
