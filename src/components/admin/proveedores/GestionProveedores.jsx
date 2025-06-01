// Componente: GestionProveedores.jsx
import { useEffect, useState, useRef } from "react";
import { BiPencil, BiPlus } from "react-icons/bi";
import { useAuth } from "../../../context/AuthContext";
import { obtenerProveedores } from "../../../services/proveedorService";
import ModalCrearProveedor from "./crear/ModalCrearProveedor";
import ModalEditarProveedor from "./editar/ModalEditarProveedor";

const GestionProveedores = () => {
  const { token } = useAuth();
  if (!token) return null;

  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [campo, setCampo] = useState("nombre");
  const [valor, setValor] = useState("");

  const scrollRef = useRef(null);

  const cargarProveedores = async () => {
    try {
      const lista = await obtenerProveedores(token);
      //   const filtrada = valor
      //     ? lista.filter((prov) => prov[campo]?.toLowerCase().includes(valor.toLowerCase()))
      //     : lista;
      setProveedores(lista);
    } catch {
      setMensajeError("Error al cargar proveedores");
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, [campo, valor]);

  return (
    <div className="container py-4" style={{ maxWidth: "1400px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">
        Gestión de proveedores
      </h4>

      <div ref={scrollRef} className="mb-3">
        {mensajeError && (
          <p className="text-danger fw-semibold">{mensajeError}</p>
        )}
        {mensajeExito && (
          <p className="text-success fw-semibold">{mensajeExito}</p>
        )}
      </div>

      <div className="d-flex justify-content-between flex-wrap gap-3 mb-3 align-items-center">
        <div className="d-flex align-items-center gap-3">
          <select
            className="form-select"
            style={{ width: "160px", borderRadius: "10px" }}
            value={campo}
            onChange={(e) => {
              setCampo(e.target.value);
              setValor("");
            }}
          >
            <option value="nombre">Nombre</option>
            <option value="email">Email</option>
            <option value="telefono">Teléfono</option>
            <option value="direccion">Dirección</option>
          </select>

          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            style={{ width: "400px", borderRadius: "10px" }}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <button
          className="btn border-0 text-white d-flex align-items-center gap-1 shadow-sm"
          style={{ backgroundColor: "#ff5c00", borderRadius: "10px" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
          onClick={() => setModalCrearVisible(true)}
        >
          <BiPlus size={18} /> Nuevo proveedor
        </button>
      </div>

      {proveedores.length === 0 ? (
        <p className="text-muted">No hay resultados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.id}</td>
                  <td>{prov.nombre}</td>
                  <td>{prov.email || "-"}</td>
                  <td>{prov.telefono || "-"}</td>
                  <td>{prov.direccion || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        prov.baja ? "bg-secondary" : "bg-success"
                      }`}
                    >
                      {prov.baja ? "Baja" : "Activo"}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn text-white shadow-sm"
                      style={{
                        backgroundColor: "#ff5c00",
                        borderRadius: "10px",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#C74900")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#ff5c00")
                      }
                      onClick={() => setProveedorEditando(prov)}
                    >
                      <BiPencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalCrearProveedor
        visible={modalCrearVisible}
        onClose={() => setModalCrearVisible(false)}
        onCreado={() => {
          setMensajeExito("✅ Proveedor creado correctamente");
          setTimeout(() => setMensajeExito(""), 3000);
          cargarProveedores();
        }}
      />

      <ModalEditarProveedor
        visible={!!proveedorEditando}
        proveedor={proveedorEditando}
        onClose={() => setProveedorEditando(null)}
        onActualizado={() => {
          setMensajeExito("✅ Proveedor actualizado correctamente");
          setTimeout(() => setMensajeExito(""), 3000);
          cargarProveedores();
        }}
      />
    </div>
  );
};

export default GestionProveedores;
