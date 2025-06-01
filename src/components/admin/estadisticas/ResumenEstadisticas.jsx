import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../../context/AuthContext";
import {
  obtenerVentasMensuales,
  obtenerResumenEstadisticas,
} from "../../../services/adminService";

const ResumenEstadisticas = () => {
  const { token } = useAuth();
  if (!token) return null;
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [resumen, setResumen] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    totalUsuarios: 0,
  });

  

  useEffect(() => {
    if (!token) return;

    obtenerVentasMensuales(token)
      .then(setVentasPorMes)
      .catch((error) =>
        console.error("Error al obtener ventas mensuales:", error)
      );

    obtenerResumenEstadisticas(token)
      .then(setResumen)
      .catch((error) =>
        console.error("Error al cargar resumen de estadísticas:", error)
      );
  }, [token]);

  return (
    <div className="container">
      <h3 className="fw-bold mb-4">Resumen general</h3>

      {/* Tarjetas resumen */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total ventas</h6>
              <h4 className="fw-bold" style={{ color: "#ff5c00" }}>
                {resumen.totalVentas.toFixed(2)} €
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Pedidos realizados</h6>
              <h4 className="fw-bold" style={{ color: "#ff5c00" }}>
                {resumen.totalPedidos}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Usuarios registrados</h6>
              <h4 className="fw-bold" style={{ color: "#ff5c00" }}>
                {resumen.totalUsuarios}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfica de ventas por mes */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h6 className="text-muted mb-3">Ventas por mes</h6>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#ff5c00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenEstadisticas;
