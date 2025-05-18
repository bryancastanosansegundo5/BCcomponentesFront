import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "/assets/BCcomponentes_logo_sinfondo.png";
import { BiCart, BiSearch } from "react-icons/bi";
import { useCarritoStore } from "../../store/carritoStore";
import { usePedidoStore } from "../../store/pedidoStore";
import { useAdminStore } from "../../store/adminStore";
import { useUserStore } from "../../store/userStore";
import { useBusquedaStore } from "../../store/busquedaStore";
import { obtenerOpcionesPorRolYUbicacion } from "../../services/menuService";
import { motion } from "framer-motion";
import "../../styles/header.css";
import { cargarCarritoYProductos } from "../../services/carritoService";
import { obtenerCategorias } from "../../services/categoriaService";
import { useCategoriaStore } from "../../store/categoriaStore";
import PanelCategorias from "../categorias/PanelCategorias";

const Header = () => {
  const { user, logout } = useAuth();
  const texto = useBusquedaStore((state) => state.texto);
  const categoriaIdBusqueda = useBusquedaStore(
    (state) => state.categoriaIdBusqueda
  );
  const setTexto = useBusquedaStore((state) => state.setTexto);
  const setCategoriaIdBusqueda = useBusquedaStore(
    (state) => state.setCategoriaIdBusqueda
  );
  const {
    panelCategoriasVisible,
    abrirPanelCategorias,
    cerrarPanelCategorias,
  } = useCategoriaStore();

  const navigate = useNavigate();
  const location = useLocation();
  const activarModoAdministracion = useAdminStore(
    (state) => state.activarModoAdministracion
  );
  const desactivarModoAdministracion = useAdminStore(
    (state) => state.desactivarModoAdministracion
  );
  const carrito = useCarritoStore((state) => state.carrito);
  const resetCarritoStore = useCarritoStore((state) => state.resetCarritoStore);

  const resetPedidoStore = usePedidoStore((state) => state.resetPedido);
  const abrirPanelCarrito = useCarritoStore((state) => state.abrirPanel);
  const abrirPanelAdmin = useAdminStore((state) => state.abrirPanel);
  const abrirPanelUsuario = useUserStore((state) => state.abrir);
  const [categorias, setCategorias] = useState([]);
  const [opcionesHeader, setOpcionesHeader] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarAdministracion = () => {
    activarModoAdministracion(); // cambia el modo en Zustand
    navigate("/empleado/gestion-productos"); // redirige a la vista de administración
  };
  const totalProductosEnCarrito = Object.values(carrito).reduce(
    (suma, cantidad) => suma + cantidad,
    0
  );
  useEffect(() => {
    obtenerCategorias()
      .then(setCategorias)
      .catch((e) => console.error(e.message));
  }, []);

  useEffect(() => {
    const cargarOpciones = async () => {
      const rolNombre = !user
        ? "CLIENTE"
        : user.rolId === 3
        ? "ADMIN"
        : user.rolId === 2
        ? "EMPLEADO"
        : "CLIENTE";

      const resultado = await obtenerOpcionesPorRolYUbicacion(
        rolNombre,
        "HEADER"
      );
      setOpcionesHeader(resultado);
    };

    cargarOpciones();
  }, [user]);

  useEffect(() => {
    if (texto.trim().length > 2 && location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  }, [texto, location.pathname]);

  return (
    <header className="bg-white border-bottom py-2 header">
      <div className="contenedor d-flex justify-content-between align-items-center header-contenedor">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img src={logo} alt="Logo de BCComponentes" className="header-logo" />
        </Link>

        {/* Categorías */}

        <motion.div
          className="d-flex align-items-center px-3 categorias-contenedor"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={abrirPanelCategorias}
            className="btn btn-link text-decoration-none fw-medium link-animado categorias-btn"
          >
            ☰ Todas las categorías
          </button>
        </motion.div>

        {/* Búsqueda */}
        <motion.div className="d-flex align-items-center px-3 flex-grow-1">
          <div className="d-flex border overflow-hidden w-100 align-items-center barra-busqueda">
            <select
              className="form-select border-0 border-end"
              value={categoriaIdBusqueda}
              onChange={(e) => setCategoriaIdBusqueda(e.target.value)}
              style={{
                flexShrink: 1,
                flexGrow: 0,
                maxWidth: "160px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <option value="">Todo el catálogo</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre[0].toUpperCase() +
                    categoria.nombre.slice(1).toLowerCase()}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar"
              style={{
                flexGrow: 1,
                flexShrink: 1,
                border: "none",
                outline: "none",
              }}
            />

            <div className="btn boton-buscar flex-shrink-0">
              <BiSearch size={20} color="#444" />
            </div>
          </div>
        </motion.div>
        <button
          className="btn toggle-menu d-lg-none"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>
        {/* Navegación */}
        <nav
          className={`menu-principal ${
            menuAbierto ? "mostrar" : ""
          }d-flex gap-3 align-items-center`}
        >
          {opcionesHeader.map(({ nombre, ruta }) =>
            nombre.toLowerCase() === "mi cesta" ? (
              <button
                key={nombre}
                onClick={abrirPanelCarrito}
                className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 flex-shrink-0 link-animado"
              >
                <div className="position-relative">
                  <BiCart size={24} color="black" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalProductosEnCarrito}
                  </span>
                </div>
                <span className="fw-medium">{nombre}</span>
              </button>
            ) : (
              <Link
                key={nombre}
                className="fw-medium link-animado text-decoration-none flex-shrink-0"
                to={ruta}
              >
                {nombre}
              </Link>
            )
          )}

          {!user ? (
            <>
              <Link
                className="btn fw-medium link-animado flex-shrink-0"
                to="/login"
              >
                Iniciar sesión
              </Link>
              <Link
                className="btn fw-medium link-animado flex-shrink-0"
                to="/registro"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={abrirPanelUsuario}
                className="btn btn-link text-decoration-none fw-medium link-animado flex-shrink-0"
                style={{
                  maxWidth: "150px", // puedes ajustar este ancho según necesites
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Hola, {user.nombre || user.email || "usuario"}
              </button>

              {user?.rolId >= 2 && (
                <button
                  className="btn fw-medium link-animado flex-shrink-0"
                  onClick={manejarAdministracion}
                >
                  Administración ☰
                </button>
              )}
            </>
          )}
        </nav>
      </div>
      <PanelCategorias />
    </header>
  );
};

export default Header;
