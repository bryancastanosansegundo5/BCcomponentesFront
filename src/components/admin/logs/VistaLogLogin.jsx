import { useEffect, useState, useRef } from "react";
import { obtenerLogsLogin, obtenerLogsErrores } from "../../../services/logService";
import { useAuth } from "../../../context/AuthContext";

const VistaLogs = () => {
  const [logs, setLogs] = useState([]);
  const [tipoActivo, setTipoActivo] = useState("accesos");
  const [error, setError] = useState("");
  const { token } = useAuth();
  const scrollRef = useRef(null);
  if (!token) return null;

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = tipoActivo === "accesos"
          ? await obtenerLogsLogin(token)
          : await obtenerLogsErrores(token);
        setLogs(datos);
      } catch {
        setError("No se pudo cargar el log.");
      }
    };
    cargar();
  }, [tipoActivo]);

  return (
    <div className="container py-4" style={{ maxWidth: "1400px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">Historial</h4>

      {/* Botones personalizados */}
      <div className="d-flex gap-3 mb-4">
  {/* Botón ACCESOS */}
  <button
    className="btn fw-semibold d-flex align-items-center justify-content-center"
    style={{
      border: "2px solid #ff5c00",
      backgroundColor: tipoActivo === "accesos" ? "#ff5c00" : "white",
      color: tipoActivo === "accesos" ? "white" : "#ff5c00",
      borderRadius: "10px",
      minWidth: "150px",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#ff5c00";
      e.target.style.color = "white";
      e.target.style.borderColor = "#C74900";
    }}
    onMouseLeave={(e) => {
      if (tipoActivo === "accesos") {
        e.target.style.backgroundColor = "#ff5c00";
        e.target.style.color = "white";
        e.target.style.borderColor = "#ff5c00";
      } else {
        e.target.style.backgroundColor = "white";
        e.target.style.color = "#ff5c00";
        e.target.style.borderColor = "#ff5c00";
      }
    }}
    onClick={() => setTipoActivo("accesos")}
  >
    Accesos
  </button>

  {/* Botón ERRORES */}
  <button
    className="btn fw-semibold d-flex align-items-center justify-content-center"
    style={{
      border: "2px solid #ff5c00",
      backgroundColor: tipoActivo === "errores" ? "#ff5c00" : "white",
      color: tipoActivo === "errores" ? "white" : "#ff5c00",
      borderRadius: "10px",
      minWidth: "150px",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#ff5c00";
      e.target.style.color = "white";
      e.target.style.borderColor = "#C74900";
    }}
    onMouseLeave={(e) => {
      if (tipoActivo === "errores") {
        e.target.style.backgroundColor = "#ff5c00";
        e.target.style.color = "white";
        e.target.style.borderColor = "#ff5c00";
      } else {
        e.target.style.backgroundColor = "white";
        e.target.style.color = "#ff5c00";
        e.target.style.borderColor = "#ff5c00";
      }
    }}
    onClick={() => setTipoActivo("errores")}
  >
    Errores
  </button>
</div>


      {/* Mensajes */}
      <div ref={scrollRef}>
        {error && <p className="text-danger fw-semibold">{error}</p>}
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>{tipoActivo === "accesos" ? "Nivel" : "Código"}</th>
              <th>Mensaje</th>
              {tipoActivo === "errores" && <th>Ruta</th>}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{new Date(log.timestamp.replace(",", ".")).toLocaleString()}</td>

                <td>
                  {tipoActivo === "accesos" ? (
                    <span className={`badge ${log.nivel === "INFO" ? "bg-success" : "bg-warning text-dark"}`}>
                      {log.nivel}
                    </span>
                  ) : (
                    log.status
                  )}
                </td>
                <td>{tipoActivo === "accesos" ? log.mensaje : log.message}</td>
                {tipoActivo === "errores" && <td>{log.path}</td>}
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={tipoActivo === "errores" ? 4 : 3} className="text-center text-muted">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VistaLogs;
