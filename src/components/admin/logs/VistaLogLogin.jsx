import { useEffect, useState } from "react";
import { obtenerLogsLogin } from "../../../services/logService";
import { useAuth } from "../../../context/AuthContext";


const VistaLogsLogin = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const {token }=useAuth();
  if (!token) return null;


  useEffect(() => {
    const cargarLogs = async () => {
      const resultado = await obtenerLogsLogin(token);
      setLogs(resultado);
    };

    cargarLogs();
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: "1200px" }}>
      <h2 className="fw-bold mb-4 border-bottom pb-2">Historial de accesos</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <span className="badge bg-secondary">Total: {logs.length}</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Nivel</th>
              <th scope="col">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{new Date(log.timestamp.replace(",", ".")).toLocaleString()}</td>
                <td>
                  <span className={`badge ${log.nivel === "INFO" ? "bg-success" : "bg-warning text-dark"}`}>
                    {log.nivel}
                  </span>
                </td>
                <td>{log.mensaje}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-muted">
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

export default VistaLogsLogin;
