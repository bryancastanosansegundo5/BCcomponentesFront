import "../../styles/catalogo.css";
import { useEffect, useState, useRef } from "react";
import {
  obtenerProductos,
  obtenerProductosPorCategoria,
  buscarCatalogo,
} from "../../services/productoService";
import EstrellasValoracion from "../valoracion/EstrellasValoracion";

import { useCarritoStore } from "../../store/carritoStore";
import { useBusquedaStore } from "../../store/busquedaStore";
import DetalleProducto from "./DetalleProducto";

const Catalogo = () => {
  const bloqueoCargaRef = useRef(false);
  const texto = useBusquedaStore((state) => state.texto);
  const categoriaIdBusqueda = useBusquedaStore(
    (state) => state.categoriaIdBusqueda
  );

  const [listaProductos, setListaProductos] = useState([]);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({});
  const [pagina, setPagina] = useState(0);
  const [tieneMas, setTieneMas] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const finDeCatalogo = useRef(null);

  const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  const quitarDelCarrito = useCarritoStore((state) => state.quitarProducto);
  const carrito = useCarritoStore((state) => state.carrito);

  const cargarProductosDesdeAPI = async (paginaForzada = 0) => {
    const paginaActual = paginaForzada;

    // ⚠️ Solo bloquear si no es la primera página
    const bloquear = paginaActual > 0 && (cargando || !tieneMas);

    if (bloquear) return;

    setCargando(true);

    let data;
    try {
      if (texto && texto.trim().length > 2) {
        data = await buscarCatalogo({
          nombre: texto.trim(),
          categoriaId: categoriaIdBusqueda || null,
          page: paginaActual,
          size: 12,
        });
      } else if (categoriaIdBusqueda) {
        data = await obtenerProductosPorCategoria(
          categoriaIdBusqueda,
          paginaActual,
          12
        );
        console.log(data);
      } else {
        data = await obtenerProductos(paginaActual, 12);
        console.log(data.content);
      }

      const nuevos = data.content?.filter((p) => !p.baja) || [];

      if (nuevos.length === 0 || data.last) {
        setTieneMas(false);
      }

      setListaProductos((prev) => {
        const idsExistentes = new Set(prev.map((p) => p.id));
        const nuevosUnicos = nuevos.filter((p) => !idsExistentes.has(p.id));
        return [...prev, ...nuevosUnicos];
      });

      const nuevasCantidades = {};
      nuevos.forEach((p) => {
        nuevasCantidades[p.id] = carrito[p.id] || 0;
      });

      setCantidadSeleccionada((prev) => ({ ...prev, ...nuevasCantidades }));
      setPagina((p) => p + 1);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
    } finally {
      setCargando(false);
      bloqueoCargaRef.current = false;
    }
  };

  useEffect(() => {
    if (!finDeCatalogo.current || !tieneMas || cargando) return;

    const observerInstance = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !bloqueoCargaRef.current) {
        bloqueoCargaRef.current = true;
        cargarProductosDesdeAPI(pagina);
      }
    });

    observerInstance.observe(finDeCatalogo.current);

    return () => {
      if (finDeCatalogo.current) {
        observerInstance.unobserve(finDeCatalogo.current);
      }
      observerInstance.disconnect();
    };
  }, [tieneMas, cargando]);

  useEffect(() => {
    cargarProductosDesdeAPI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setTieneMas(true);
    setPagina(0);
    setListaProductos([]);
    setCantidadSeleccionada({});
    setCargando(false);
    cargarProductosDesdeAPI(0);
  }, [texto, categoriaIdBusqueda]);

  useEffect(() => {
    const nuevasCantidades = {};
    listaProductos.forEach((p) => {
      nuevasCantidades[p.id] = carrito[p.id] || 0;
    });
    setCantidadSeleccionada(nuevasCantidades);
  }, [carrito, listaProductos]);

  const aumentarCantidad = (id) => {
    setCantidadSeleccionada((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
    agregarProducto(id);
  };

  const disminuirCantidad = (id) => {
    const cantidadActual = carrito[id] || 0;
    if (cantidadActual > 0) {
      setCantidadSeleccionada((prev) => ({
        ...prev,
        [id]: cantidadActual - 1,
      }));
      quitarDelCarrito(id);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "1400px" }}>
      <h2 className="text-center mb-4">Bienvenido a la tienda</h2>

      {listaProductos.length === 0 ? (
        <p className="text-center">No hay productos para mostrar.</p>
      ) : (
        <div className="row g-4">
          {listaProductos.map((producto, index) => {
            const esUltimoProducto = index === listaProductos.length - 1;
            return (
              <div
                className="col-md-4"
                key={producto.id}
                ref={esUltimoProducto ? finDeCatalogo : null}
              >
                <div
                  className="card h-100 shadow-sm card-hover"
                  onClick={() => setProductoSeleccionado(producto.id)}
                >
                  {producto.imagen && (
                    <div className="img-zoom contenedor-imagen-producto">
                      <img
                        className="card-img-top"
                        alt={`Imagen de ${producto.nombre}`}
                        src={producto.imagen}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}

                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text mt-2">{producto.descripcion}</p>

                      <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                        <span className="fw-bold">{producto.precio} €</span>
                        <div
                          style={{
                            fontSize: "1.1rem",
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

                      <p className="card-text text-muted">
                        Stock: {producto.stock}
                      </p>
                    </div>

                    <div className="mt-3">
                      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                        <button
                          className="btn rounded-circle px-3 py-1"
                          style={{
                            border: "2px solid #dc3545",
                            color: "#dc3545",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#ff5c00";
                            e.target.style.borderColor = "#ff5c00";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.borderColor = "#dc3545"; // o el color original que tú quieras
                            e.target.style.color = "#dc3545"; // o rojo si es el menos
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            disminuirCantidad(producto.id);
                          }}
                        >
                          –
                        </button>

                        <span
                          className="badge bg-light text-dark fs-6 px-3 py-2"
                          style={{
                            borderRadius: "10px",
                            boxShadow:
                              cantidadSeleccionada[producto.id] > 0
                                ? "0 0 10px 3px rgba(255, 92, 0, 0.5)"
                                : "",
                            minWidth: "40px",
                            textAlign: "center",
                          }}
                        >
                          {cantidadSeleccionada[producto.id] || 0}
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
                            e.target.style.borderColor = "#ff5c00";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.borderColor = "#28a745"; // o el color original que tú quieras
                            e.target.style.color = "#28a745"; // o rojo si es el menos
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            aumentarCantidad(producto.id);
                          }}
                        >
                          +
                        </button>

                        <button
                          className="btn text-white"
                          style={{
                            backgroundColor: "#ff5c00",
                            borderRadius: "10px",
                            padding: "6px 12px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductoSeleccionado(producto.id);
                          }}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {productoSeleccionado !== null && (
        <DetalleProducto
          idProducto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default Catalogo;
