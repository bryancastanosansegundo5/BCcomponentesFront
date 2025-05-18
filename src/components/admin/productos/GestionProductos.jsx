import { useEffect, useState, useRef } from "react";
import { BiGridAlt, BiListUl, BiPencil, BiPlus } from "react-icons/bi";
import { obtenerProductosTodos } from "../../../services/productoService";
import { obtenerProveedores } from "../../../services/proveedorService";
import {
  crearProducto,
  buscarProductosGestion,
} from "../../../services/empleadoService";
import { obtenerCategorias } from "../../../services/categoriaService";
import {
  camposBusquedaProductos,
  rangosStock,
} from "../../../utils/configuracionUI";
import { motion, AnimatePresence } from "framer-motion";
import ModalAgregarProducto from "./crear/ModalAgregarProducto";
import ModalImportarProducto from "./importar/ModalImportarProducto";
import { useAuth } from "../../../context/AuthContext";
import ModalEditarProducto from "./editar/ModalEditarProducto";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [modoVista, setModoVista] = useState("tabla");
  const [mostrarModalImportar, setMostrarModalImportar] = useState(false);

  const [campo, setCampo] = useState("nombre");
  const [valor, setValor] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const scrollRef = useRef(null);
  const {  token } = useAuth();
  if (!token) return null;

  const cargarProductos = async () => {
    try {
      const lista = valor
        ? await buscarProductosGestion(token, campo, valor)
        : await obtenerProductosTodos();
      setProductos(lista);
    } catch (error) {
      setMensajeError(error.message || "Error al cargar los productos");
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  const cargarCategorias = async () => {
    try {
      const lista = await obtenerCategorias();

      setCategorias(lista);
    } catch {
      setCategorias([]);
    }
  };

  const cargarProveedores = async () => {
    try {
      const lista = await obtenerProveedores();
      setProveedores(lista);
    } catch {
      setProveedores([]);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarProveedores();
  }, [campo, valor]);

  const handleToggleVista = () => {
    setModoVista((prev) => (prev === "tabla" ? "grid" : "tabla"));
  };

  

  return (
    <div className="container py-4" style={{ maxWidth: "1400px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">Gestión de productos</h4>

      <div ref={scrollRef}>
        {mensajeError && (
          <p className="text-danger fw-semibold">{mensajeError}</p>
        )}
        {mensajeExito && (
          <p className="text-success fw-semibold">{mensajeExito}</p>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <select
            className="form-select"
            style={{ width: "160px", borderRadius: "10px" }}
            value={campo}
            onChange={(e) => {
              setCampo(e.target.value);
              setValor("");
            }}
          >
            {camposBusquedaProductos.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {campo === "categoria" ? (
            <select
              className="form-select"
              style={{ width: "200px", borderRadius: "10px" }}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            >
              <option value="">-- Categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          ) : campo === "stock" ? (
            <select
              className="form-select"
              style={{ width: "200px", borderRadius: "10px" }}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            >
              {rangosStock.map((rango) => (
                <option key={rango.value} value={rango.value}>
                  {rango.label}
                </option>
              ))}
            </select>
          ) : campo === "baja" ? (
            <select
              className="form-select"
              style={{ width: "160px", borderRadius: "10px" }}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            >
              <option value="">-- Estado --</option>
              <option value="true">Activo</option>
              <option value="false">Baja</option>
            </select>
          ) : (
            <input
              type="text"
              className="form-control"
              placeholder="Buscar..."
              style={{ width: "400px", borderRadius: "10px" }}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          )}
          <button
            className="btn p-2 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "10px",
              color: "#333",
            }}
            title={
              modoVista === "tabla" ? "Cambiar a cuadrícula" : "Cambiar a tabla"
            }
            onClick={handleToggleVista}
          >
            {modoVista === "tabla" ? (
              <BiGridAlt size={20} />
            ) : (
              <BiListUl size={20} />
            )}
          </button>
        </div>
        <div className="d-flex gap-4">
          <button
            className="btn fw-semibold d-flex align-items-center "
            style={{
              border: "2px solid #ff5c00",
              backgroundColor: "white",
              color: "#ff5c00",
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
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#ff5c00";
              e.target.style.borderColor = "#ff5c00";
            }}
            onClick={() => setMostrarModalImportar(true)}
          >
            Importar desde Excel
          </button>

          <button
            className="btn border-0 fw-semibold text-white d-flex align-items-center gap-2"
            style={{
              backgroundColor: "#ff5c00",
              borderRadius: "10px",
              minWidth: "150px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
            onClick={() => setModalVisible(true)}
          >
            <BiPlus size={20} />
            Agregar producto
          </button>
        </div>
      </div>
      <ModalAgregarProducto
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreado={() => {
          setModalVisible(false);
          cargarProductos();
        }}
      />
      {modalEditarVisible && productoSeleccionado && (
        <ModalEditarProducto
          visible={true}
          producto={productoSeleccionado}
          onClose={() => {
            setModalEditarVisible(false);
            setProductoSeleccionado(null);
          }}
          onActualizado={() => {
            setModalEditarVisible(false);
            setProductoSeleccionado(null);
            cargarProductos();
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {modoVista === "tabla" ? (
          <motion.div
            key="tabla"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoria</th>
                    <th>Precio</th>
                    <th>Ventas</th>
                    <th>Stock</th>
                    <th>Proveedor</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.id}</td>
                      <td>
                        {prod.imagen && (
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            style={{ height: "40px", objectFit: "contain" }}
                          />
                        )}
                      </td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                      >
                        {prod.nombre}
                      </td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                      >
                        {categorias.find((cat) => cat.id === prod.categoriaId)
                          ?.nombre || "Sin categoría"}
                      </td>
                      <td>{prod.precio} €</td>
                      <td>{prod.vendidos}</td>
                      <td>{prod.stock}</td>
                      <td>
                        {proveedores.find(
                          (proveedor) => proveedor.id === prod.proveedorId
                        )?.nombre || "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            prod.baja ? "bg-secondary" : "bg-success"
                          }`}
                        >
                          {prod.baja ? "Baja" : "Activo"}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn text-white"
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
                            title="Editar"
                            onClick={() => {
                              setProductoSeleccionado({
                                ...prod,
                              });

                              setModalEditarVisible(true);
                            }}
                          >
                            <BiPencil />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="row g-4"
          >
            {productos.map((prod) => (
              <div key={prod.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  {prod.imagen && (
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="card-img-top"
                      style={{
                        height: "180px",
                        objectFit: "contain",
                        padding: "10px",
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{prod.nombre}</h5>
                    <p className="card-text">{prod.descripcion}</p>
                    <p className="fw-bold">{prod.precio} €</p>
                    <p className="text-muted">Stock: {prod.stock}</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button
                        className="btn text-white"
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
                        title="Editar"
                        onClick={() => {
                          setProductoSeleccionado({
                            ...prod,
                          });
                          setModalEditarVisible(true);
                        }}
                      >
                        <BiPencil />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
        {productos.length === 0 && (
          <div className="text-center mt-4 text-muted fw-semibold">
            No hay productos en el catálogo
          </div>
        )}
      </AnimatePresence>
      <ModalImportarProducto
        visible={mostrarModalImportar}
        onClose={() => setMostrarModalImportar(false)}
        onImportado={cargarProductos}
      />
    </div>
  );
};

export default GestionProductos;
