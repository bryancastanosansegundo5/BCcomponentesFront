import { useEffect, useState, useRef } from "react";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  eliminarConfiguracion,
} from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";

import ModalEditarConfiguracion from "./editar/ModalEditarConfiguracion";
import ModalNuevaConfiguracion from "./crear/ModalNuevaConfiguracion";
import ModalEliminarConfiguracion from "./eliminar/ModalEliminarConfiguracion";

import { BiPencil, BiTrash, BiPlus } from "react-icons/bi";

const Configuracion = () => {
  const { user: usuarioAutenticado,token } = useAuth();
  if (!token) return null;


  const [config, setConfig] = useState([]);
  const [configEditando, setConfigEditando] = useState(null);
  const [configEliminando, setConfigEliminando] = useState(null);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const scrollRef = useRef(null);

  const cargarConfiguracion = async () => {
    try {
      const datos = await obtenerConfiguracion(token);
      setConfig(datos);
    } catch (err) {
      setMensajeError("No se pudo cargar la configuración.");
    }
  };

  const handleGuardarDesdeModal = async (id, clave, nuevoValor) => {
    try {
      await actualizarConfiguracion(token, id, clave, nuevoValor);
      setMensajeExito(`✅ Configuración "${clave}" actualizada.`);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeExito(""), 3000);
      setConfigEditando(null);
      await cargarConfiguracion();
    } catch (err) {
      setMensajeError("❌ Error al guardar los cambios.");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  const crearConfiguracion = async (clave, valor) => {
    try {
      await actualizarConfiguracion(token, clave, valor);
      setMensajeExito(`✅ Clave "${clave}" creada correctamente.`);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeExito(""), 3000);
      setModalCrearVisible(false);
      await cargarConfiguracion();
    } catch (err) {
      setMensajeError("❌ Error al crear configuración (¿clave duplicada?).");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  const eliminar = async (clave) => {
    try {
      await eliminarConfiguracion(token, clave);
      setMensajeExito(`✅ Clave "${clave}" eliminada correctamente.`);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeExito(""), 3000);
      await cargarConfiguracion();
    } catch {
      setMensajeError("❌ Error al eliminar configuración.");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: "1400px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">
        Configuración de la tienda
      </h4>
  
      <div ref={scrollRef}>
        {mensajeError && (
          <p className="text-danger fw-semibold">{mensajeError}</p>
        )}
        {mensajeExito && (
          <p className="text-success fw-semibold">{mensajeExito}</p>
        )}
      </div>
  
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn border-0 text-white d-flex align-items-center gap-1 shadow-sm"
          style={{
            backgroundColor: "#ff5c00",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
          onClick={() => setModalCrearVisible(true)}
          title="Añadir nueva configuración"
        >
          <BiPlus size={18} />
          Nueva configuración
        </button>
      </div>
  
      {config.length === 0 ? (
        <p className="text-muted">No hay datos de configuración.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Clave</th>
                <th>Valor</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {config.map((cfg) => (
                <tr key={cfg.clave}>
                  <td className="text-muted">{cfg.clave}</td>
                  <td>{cfg.valor}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn text-white shadow-sm"
                        style={{
                          backgroundColor: "#ff5c00",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          {e.target.style.backgroundColor = "#C74900"}
                        }
                        onMouseLeave={(e) =>
                          {e.target.style.backgroundColor = "#ff5c00"}
                        }
                        onClick={() => setConfigEditando(cfg)}
                        title="Editar configuración"
                      >
                        <BiPencil size={18} />
                      </button>
                      {/* <button
                        className="btn shadow-sm"
                        style={{
                          backgroundColor: "#fff",
                          color: "#ff5c00",
                          border: "1px solid #ff5c00",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#ffece2";
                          e.target.style.borderColor = "#C74900";
                          e.target.style.color = "#C74900";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#fff";
                          e.target.style.borderColor = "#ff5c00";
                          e.target.style.color = "#ff5c00";
                        }}
                        onClick={() => setConfigEliminando(cfg)}
                        title="Eliminar configuración"
                      >
                        <BiTrash size={18} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      <ModalEditarConfiguracion
        visible={!!configEditando}
        config={configEditando}
        onClose={() => setConfigEditando(null)}
        onGuardar={handleGuardarDesdeModal}
      />
  
      <ModalNuevaConfiguracion
        visible={modalCrearVisible}
        onClose={() => setModalCrearVisible(false)}
        onCrear={crearConfiguracion}
      />
  
      <ModalEliminarConfiguracion
        visible={!!configEliminando}
        config={configEliminando}
        onClose={() => setConfigEliminando(null)}
        onConfirmar={eliminar}
      />
    </div>
  );
  
};

export default Configuracion;
