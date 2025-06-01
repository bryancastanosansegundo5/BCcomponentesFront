import { useState } from "react";
import ResumenEstadisticas from "./ResumenEstadisticas";
// import EstadisticasProductos from "./EstadisticasProductos";
// import EstadisticasVentas from "./EstadisticasVentas";
// import EstadisticasUsuarios from "./EstadisticasUsuarios";
import { useAuth } from "../../../context/AuthContext";

const VistaEstadisticas = () => {
  const [vistaActual, setVistaActual] = useState("resumen");
  const { token } = useAuth();
  if (!token) return null;
  const renderContenido = () => {
    switch (vistaActual) {
      default:
        return <ResumenEstadisticas />;
    }
  };
  const getEstiloBoton = (clave) => ({
    backgroundColor: vistaActual === clave ? "#ff5c00" : "transparent",
    color: vistaActual === clave ? "white" : "black",
    borderRadius: "8px",
    padding: "10px 12px",
    textAlign: "left",
    transition: "all 0.2s ease",
    border: "none",
  });

  return (
    <div className="d-flex" >
      {/* Menú lateral */}
      <aside
        className="bg-light border-end p-3"
        style={{ width: "220px", minHeight: "100%" }}
      >
        <h5 className="fw-bold mb-4">Estadísticas</h5>
        <ul className="nav flex-column gap-2">
          <li>
            <button
              style={getEstiloBoton("resumen")}
              className="w-100 fw-medium link-animado"
              onClick={() => setVistaActual("resumen")}
            >
              Resumen general
            </button>
          </li>
          <li>
            <button
              style={getEstiloBoton("productos")}
              className="w-100 fw-medium link-animado"
              onClick={() => setVistaActual("productos")}
            >
              Productos
            </button>
          </li>
          <li>
            <button
              style={getEstiloBoton("ventas")}
              className="w-100 fw-medium link-animado"
              onClick={() => setVistaActual("ventas")}
            >
              Ventas
            </button>
          </li>
          <li>
            <button
              style={getEstiloBoton("usuarios")}
              className="w-100 fw-medium link-animado"
              onClick={() => setVistaActual("usuarios")}
            >
              Usuarios
            </button>
          </li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className="flex-grow-1 p-4">{renderContenido()}</main>
    </div>
  );
};

export default VistaEstadisticas;
