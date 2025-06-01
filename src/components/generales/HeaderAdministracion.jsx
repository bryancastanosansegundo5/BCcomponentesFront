import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdminStore } from "../../store/adminStore";
import logo from "/assets/BCcomponentes_logo_sinfondo.png";
import { BiLogOut } from "react-icons/bi";
import { obtenerOpcionesGestion } from "../../services/menuService";
import { useCarritoStore } from "../../store/carritoStore";
import { usePedidoStore } from "../../store/pedidoStore";
import "../../styles/header.css";

const HeaderAdministracion = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const desactivarModoAdministracion = useAdminStore(
    (state) => state.desactivarModoAdministracion
  );
  const activarModoAdministracion = useAdminStore((state) => state.abrirPanel);
  const resetCarritoStore = useCarritoStore((state) => state.resetCarritoStore);
  const resetPedidoStore = usePedidoStore((state) => state.resetPedido);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [opcionesEmpleado, setOpcionesEmpleado] = useState([]);

  useEffect(() => {
    if (user?.rolId >= 2) {
      obtenerOpcionesGestion(user.id)
        .then((opciones) => {
          // Filtrar solo las de empleado
          const soloEmpleado = opciones.filter((opcion) =>
            opcion.ruta?.includes("/empleado")
          );
          setOpcionesEmpleado(soloEmpleado);
        })
        .catch(console.error);
    } else {
      setOpcionesEmpleado([]);
    }
  }, [user]);

  const manejarLogout = () => {
    desactivarModoAdministracion();
    resetCarritoStore();
    resetPedidoStore();

    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-bottom py-2 header">
      <div className="contenedor d-flex justify-content-between align-items-center header-contenedor">
        {/* IZQUIERDA: logo + volver */}
        <div>
          <Link
            to="/"
            onClick={desactivarModoAdministracion}
            className="d-flex align-items-center text-decoration-none"
          >
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
        </div>
        <button
          className="btn toggle-menu d-lg-none"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>
        {/* DERECHA: navegación + admin + logout */}
        <nav
          className={`menu-principal ${
            menuAbierto ? "mostrar" : ""
          }d-flex gap-3 align-items-center`}
        >
          {opcionesEmpleado.map(({ nombre, ruta }) => (
            <Link
              key={nombre}
              to={ruta}
              className="fw-medium link-animado text-decoration-none text-dark"
            >
              {nombre}
            </Link>
          ))}

          {user?.rolId === 3 && (
            <button
              onClick={activarModoAdministracion}
              className="btn fw-medium link-animado flex-shrink-0"
            >
              Administración ☰
            </button>
          )}

          <button
            onClick={manejarLogout}
            className="btn text-decoration-none d-flex text-white align-items-center gap-1 link-animado"
            style={{ backgroundColor: "#ff5c00" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
          >
            <BiLogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default HeaderAdministracion;
