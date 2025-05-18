import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-hot-toast";
// import { actualizarProveedor } from "../../../../services/proveedorService";

const ModalEditarProveedor = ({
  visible,
  onClose,
  proveedor,
  onActualizado,
}) => {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    direccion: "",
    email: "",
    telefono: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible && proveedor) {
      setForm({
        id: proveedor.id,
        nombre: proveedor.nombre || "",
        direccion: proveedor.direccion || "",
        email: proveedor.email || "",
        telefono: proveedor.telefono || "",
      });
    }
  }, [visible, proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    return "";
  };

  const handleGuardar = async () => {
    // const msg = validar();
    // if (msg) return setError(msg);
    // try {
    //   await actualizarProveedor(form);
    //   toast.success("✅ Proveedor actualizado correctamente");
    //   onActualizado();
    //   onClose();
    // } catch (e) {
    //   setError(e.message || "Error al actualizar proveedor");
    // }
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
            backgroundColor: "rgba(0,0,0,0.5)",
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
          style={{ width: "500px", borderRadius: "20px" }}

        >
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <BiEdit size={22} /> Editar proveedor
          </h5>
          <div className="mb-2">
            <label className="form-label">Nombre *</label>
            <input
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Dirección</label>
            <input
              name="direccion"
              className="form-control"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Teléfono</label>
            <input
              name="telefono"
              className="form-control"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-danger fw-semibold">{error}</p>}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn text-white"
              style={{ backgroundColor: "#ff5c00" }}
              onClick={handleGuardar}
            >
              Guardar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEditarProveedor;
