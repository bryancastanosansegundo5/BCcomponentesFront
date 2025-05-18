import "../../styles/miInicio.css";
import imagenCabecera from "/assets/header-bccomponentes.png";
import React, { useEffect, useState } from "react";
import { obtenerCategoriasResumen } from "../../services/categoriaService";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerRecomendaciones,
  obtenerMasVendidos,
  obtenerMenosVendidos,
  obtenerMasVendidosPorCategoria,
} from "../../services/productoService";
import DetalleProducto from "../catalogo/DetalleProducto";
import Recomendaciones from "../catalogo/Recomendaciones";
import { useLocation, useNavigate } from "react-router-dom";
import { imagenesCategorias } from "../../utils/configuracionUI";
import { useBusquedaStore } from "../../store/busquedaStore";
const Inicio = () => {
  

  const [productosTopPorCategoria, setProductosTopPorCategoria] = useState({});
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const setBusquedaDesdeCategoria = useBusquedaStore(
    (state) => state.setBusquedaDesdeCategoria
  );
  const resetBusqueda = useBusquedaStore(
    (state) => state.resetBusqueda
  );
  const [categorias, setCategorias] = useState([]);
  const [similares, setSimilares] = useState([]);
  const [complementarios, setComplementarios] = useState([]);
  const [masVendidos, setMasVendidos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosOfertas, setProductosOfertas] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  useEffect(() => {
    const idsGuardados = Cookies.get(`historial_${user?.id || "anonimo"}`);
    const productoIds = idsGuardados ? JSON.parse(idsGuardados) : [];

    obtenerMasVendidos().then(setMasVendidos);
    obtenerMenosVendidos().then(setProductosOfertas);

    obtenerRecomendaciones(productoIds, user?.id)
      .then((data) => {
        setSimilares(data.similares || []);
        setComplementarios(data.complementarios || []);
      })
      .catch((error) => {
        console.error("❌ Error cargando recomendaciones:", error);
      });
  }, [user]);

  useEffect(() => {
    obtenerCategoriasResumen()
      .then(setCategorias)
      .catch((err) => console.error("Error al cargar categorías", err));
      resetBusqueda();
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClick = (categoriaId) => {
    setBusquedaDesdeCategoria(categoriaId.toString());
    navigate("/catalogo");
  };

  useEffect(() => {
    if (categorias.length === 0) return;

    categorias.forEach((categoria) => {
      obtenerMasVendidosPorCategoria(categoria.id).then((productos) => {
        setProductosTopPorCategoria((prev) => ({
          ...prev,
          [categoria.nombre]: productos,
        }));
      });
    });
    if (categoriaActiva === null) {
      setCategoriaActiva(categorias[0].id);
    }
  }, [categorias]);

  return (
    <div className="contenedor">
      <main>
        <div className="banner-wrapper">
          <img src={imagenCabecera} alt="Banner" className="banner-imagen" />
        </div>

        <section id="ofertas" className="mt-5 mb-5">
          <h2 className="mt-3 mb-3">
            ¡Consigue las ofertas más TOP del momento!
          </h2>
          <div className="productos-scroll">
            {productosOfertas.map((producto) => (
              <div
                className="card-producto"
                key={producto.id}
                onClick={() => setProductoSeleccionado(producto.id)}
                style={{ cursor: "pointer" }}
              >
                <img src={producto.imagen} alt={producto.nombre} />
                <h6 style={{ fontSize: "0.9rem" }}>{producto.nombre}</h6>
                <p className="fw-bold text-success">
                  {producto.precio.toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
        </section>

        <div>
          <h2>Categorias</h2>
          <section id="opciones">
            {categorias.map((categoria) => {
              const nombre = categoria.nombre.toLowerCase();
              let imagen = "/assets/categorias/cpuCategorias.png";

              for (const categoriaImg of imagenesCategorias) {
                const [clave, valor] = Object.entries(categoriaImg)[0];
                if (nombre.includes(clave)) {
                  imagen = valor;
                  break;
                }
              }

              return (
                <div key={categoria.id} className="opcion">
                  <div className="contenedor-imagen-categoria">
                    <img src={imagen} alt={categoria.nombre} />
                  </div>
                  <button
                    className="overlay"
                    onClick={() => {
                      handleClick(categoria.id);
                    }}
                  >
                    {/* {categoria.nombre.toUpperCase()} */}
                  </button>
                </div>
              );
            })}
          </section>
        </div>

        <section id="seleccion-top">
          <div className="seleccion-texto">
            {/* <p className="texto-azul">Selección TOP</p> */}
            <img
              src="https://img.pccomponentes.com/pcblog/1704754800000/312x40-seleccio-n-top.png"
              alt="Selección TOP"
              className="texto-azul"
            />
            <p>
              La tecnología que quieres a un precio increíble en marcas TOP.
              ¡Aprovecha ahora!
            </p>
          </div>
          <div id="seleccion-opciones">
            <ul id="seleccion-lista">
              {categorias.map((categoria) => (
                <li
                  className={`lista-elemento ${
                    categoriaActiva === categoria.id ? "activo" : ""
                  }`}
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                >
                  {categoria.nombre}
                </li>
              ))}
            </ul>

            <div id="seleccion-elementos">
              {categorias.map(
                (categoria) =>
                  categoriaActiva === categoria.id && (
                    <div key={categoria.id} className="categoria-productos">
                      {productosTopPorCategoria[categoria.nombre]?.map(
                        (producto) => (
                          <div
                            className="producto-elemento"
                            key={producto.id}
                            onClick={() => setProductoSeleccionado(producto.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={producto.imagen} alt={producto.nombre} />
                            <h6>{producto.nombre}</h6>
                            <p className="fw-bold">
                              {producto.precio.toFixed(2)} €
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        </section>

        <Recomendaciones
          usuarioId={user?.id}
          onProductoClick={setProductoSeleccionado}
        />

        {masVendidos.length > 0 && (
          <section className="productos-mas-vendidos">
            <h2>Descubre los productos más vendidos</h2>
            <div className="productos-mas-vendidos-lista">
              {masVendidos.map((producto) => (
                <div
                  className="producto-grid"
                  key={producto.id}
                  onClick={() => setProductoSeleccionado(producto.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={producto.imagen} alt={producto.nombre} />
                  <h5>{producto.nombre}</h5>
                  <p>{producto.precio} €</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

     

      {productoSeleccionado && (
        <DetalleProducto
          idProducto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default Inicio;
