import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiPackage } from "react-icons/bi";
import { actualizarProducto } from "../../../../services/empleadoService";
import { obtenerCategorias } from "../../../../services/categoriaService";
import { useAuth } from "../../../../context/AuthContext";
import { obtenerProveedores } from "../../../../services/proveedorService";
import { toast } from "react-hot-toast";

const FACTOR_FORMAS = ["ATX", "Micro ATX", "Mini ITX", "E-ATX"];

const ModalEditarProducto = ({ visible, producto, onClose, onActualizado }) => {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagen: "",
    categoriaId: "",
    socket: "",
    potenciaW: "",
    consumo: "",
    tipoRam: "",
    pcie: "",
    chipset: "",
    factorForma: "",
    proveedorId: "",
    baja: false,
  });

  const { user, token } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  const handleConfirmarEdicion = async () => {
    setConfirmando(false);
    await handleActualizar();
  };

  useEffect(() => {
    if (visible) {
      obtenerCategorias()
        .then(setCategorias)
        .catch(() => setCategorias([]));
      obtenerProveedores()
        .then(setProveedores)
        .catch(() => setProveedores([]));
    }
  }, [visible]);

  useEffect(() => {
    if (visible && producto) {
      setForm({
        id: producto.id || "",
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || 0,
        stock: producto.stock || 0,
        imagen: producto.imagen || "",
        categoriaId:
          producto.categoria?.id?.toString() ||
          producto.categoriaId?.toString() ||
          "",
        socket: producto.socket || "",
        potenciaW: producto.potenciaW || "",
        consumo: producto.consumo || "",
        tipoRam: producto.tipoRam || "",
        pcie: producto.pcie || "",
        chipset: producto.chipset || "",
        factorForma: producto.factorForma || "",
        proveedorId:
          producto.proveedor?.id?.toString() ||
          producto.proveedorId?.toString() ||
          "",
        baja: producto.baja !== undefined ? producto.baja : !producto.activo,
      });
    }
  }, [producto, visible]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.descripcion.trim()) return "La descripción es obligatoria";
    if (!form.precio || form.precio <= 0) return "El precio debe ser mayor a 0";
    if (form.stock < 0) return "El stock no puede ser negativo";
    if (!form.categoriaId) return "Selecciona una categoría";
    if (form.consumo && parseInt(form.consumo) <= 0)
      return "El consumo debe ser mayor que 0";
    return "";
  };

  const handleActualizar = async () => {
    const errorValidacion = validar();
    if (errorValidacion) return setError(errorValidacion);
    try {
      const datosAEnviar = {
        id: form.id,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        imagen: form.imagen,
        categoriaId: parseInt(form.categoriaId),
        socket: form.socket || null,
        consumo: form.consumo ? parseInt(form.consumo) : null,
        potenciaW: form.potenciaW ? parseInt(form.potenciaW) : null,
        tipoRam: form.tipoRam || null,
        pcie: form.pcie || null,
        chipset: form.chipset || null,
        factorForma: form.factorForma || null,
        proveedorId: form.proveedorId ? parseInt(form.proveedorId) : null,
        baja: form.baja,
      };
      await actualizarProducto(token, form.id, datosAEnviar);
      toast.custom((t) => (
        <div
          style={{
            background: "#e6f4ea",
            color: "#256029",
            border: "1px solid #a1d6b0",
            fontWeight: 500,
            padding: "12px 16px",
            borderRadius: "8px",
            maxWidth: "320px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ flex: 1 }}>✅ Artículo actualizado correctamente</span>
          <button
            style={{
              marginLeft: "1rem",
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              paddingRight: "4px",
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            ×
          </button>
        </div>
      ));
      onActualizado();
      onClose();
    } catch (err) {
      const mensaje =
        (await err.response?.text?.()) || "Error al actualizar el producto";
      setError(mensaje);
    }
  };

  const renderCamposEspecificos = () => {
    const categoriaSeleccionada = categorias.find(
      (cat) => cat.id === parseInt(form.categoriaId)
    );
    const tipo = categoriaSeleccionada?.nombre.toLowerCase();

    switch (tipo) {
      case "cpu":
        return (
          <>
            <div className="mb-2">
              <label htmlFor="consumo" className="form-label">
                Consumo (W) *
              </label>
              <input
                name="consumo"
                className="form-control"
                placeholder="Ejemplo: 150"
                value={form.consumo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="socket" className="form-label">
                Socket *
              </label>
              <input
                name="socket"
                className="form-control"
                placeholder="Ejemplo: LGA1700, AM5..."
                value={form.socket}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case "caja":
        return (
          <div className="mb-2">
            <label htmlFor="factorForma" className="form-label">
              Factor de forma *
            </label>
            <select
              name="factorForma"
              className="form-select"
              value={form.factorForma}
              onChange={handleChange}
            >
              <option value="">Selecciona el formato</option>
              {FACTOR_FORMAS.map((forma, identificadorForma) => (
                <option key={identificadorForma} value={forma}>
                  {forma}
                </option>
              ))}
            </select>
          </div>
        );
      case "gpu":
        return (
          <>
            <div className="mb-2">
              <label htmlFor="consumo" className="form-label">
                Consumo (W) *
              </label>
              <input
                name="consumo"
                className="form-control"
                placeholder="Ejemplo: 225"
                value={form.consumo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="pcie" className="form-label">
                PCIe *
              </label>
              <input
                name="pcie"
                className="form-control"
                placeholder="Ejemplo: PCIe 4.0"
                value={form.pcie}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case "ram":
        return (
          <div className="mb-2">
            <label htmlFor="tipoRam" className="form-label">
              Tipo de RAM *
            </label>
            <input
              name="tipoRam"
              className="form-control"
              placeholder="Ejemplo: DDR4, DDR5..."
              value={form.tipoRam}
              onChange={handleChange}
            />
          </div>
        );
      case "placa":
        return (
          <>
            <div className="mb-2">
              <label htmlFor="socket" className="form-label">
                Socket *
              </label>
              <input
                name="socket"
                className="form-control"
                placeholder="Ejemplo: AM5, LGA1700..."
                value={form.socket}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="tipoRam" className="form-label">
                Tipo de RAM *
              </label>
              <input
                name="tipoRam"
                className="form-control"
                placeholder="Ejemplo: DDR5"
                value={form.tipoRam}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="pcie" className="form-label">
                PCIe *
              </label>
              <input
                name="pcie"
                className="form-control"
                placeholder="Ejemplo: PCIe 5.0"
                value={form.pcie}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="factorForma" className="form-label">
                Factor de forma *
              </label>
              <select
                name="factorForma"
                className="form-select"
                value={form.factorForma}
                onChange={handleChange}
              >
                <option value="">Selecciona el formato</option>
                {FACTOR_FORMAS.map((forma, identificadorForma) => (
                  <option key={identificadorForma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "fuente":
        return (
          <div className="mb-2">
            <label htmlFor="potenciaW" className="form-label">
              Potencia (W) *
            </label>
            <input
              name="potenciaW"
              className="form-control"
              placeholder="Ejemplo: 750"
              value={form.potenciaW}
              onChange={handleChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: confirmando ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          className="modal-content bg-white p-4 rounded"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          style={{
            width: "800px",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "20px",
            filter: confirmando ? "brightness(0.6)" : "none",
            pointerEvents: confirmando ? "none" : "auto",
          }}
        >
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <BiPackage size={22} /> Editar producto
          </h5>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  rows={3}
                  value={form.descripcion}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="proveedorId" className="form-label">
                  Proveedor *
                </label>
                <select
                  className="form-select"
                  name="proveedorId"
                  value={form.proveedorId}
                  onChange={handleChange}
                >
                  <option value="">Sin proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="precio" className="form-label">
                    Precio *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    className="form-control"
                    value={form.precio}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="stock" className="form-label">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={form.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">
                  Imagen (URL) *
                </label>
                <input
                  type="text"
                  name="imagen"
                  className="form-control"
                  value={form.imagen}
                  placeholder="Pon el enlace de la imagen del producto"
                  onChange={handleChange}
                />
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="baja"
                  name="baja"
                  checked={form.baja}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="baja">
                  Producto dado de baja
                </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="categoriaId" className="form-label">
                  Categoría *
                </label>
                <select
                  className="form-select"
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Selecciona categoría
                  </option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {renderCamposEspecificos()}
              {error && <small className="text-danger">{error}</small>}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn text-white"
              style={{ backgroundColor: "#6c757d" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a6268")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c757d")}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="btn border-0 text-white"
              style={{ backgroundColor: "#ff5c00" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
              onClick={() => setConfirmando(true)}
            >
              Guardar cambios
            </button>
          </div>
        </motion.div>

        {confirmando && (
          <motion.div
            className="modal-content bg-white p-3 rounded shadow"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: "300px",
              textAlign: "center",
              borderRadius: "15px",
              zIndex: 10000,
            }}
          >
            <p className="fw-bold">¿Deseas guardar los cambios?</p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light"
                onClick={() => setConfirmando(false)}
              >
                Cancelar
              </button>
              <button
                className="btn text-white"
                style={{ backgroundColor: "#ff5c00" }}
                onClick={handleConfirmarEdicion}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEditarProducto;
