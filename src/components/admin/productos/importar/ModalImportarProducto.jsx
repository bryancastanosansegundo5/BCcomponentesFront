import { useState,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiUpload, BiDownload } from "react-icons/bi";
import { toast } from "react-hot-toast";
import {
  importarProductosExcel,
  descargarPlantillaExcel,
} from "../../../../services/empleadoService";
import { useAuth } from "../../../../context/AuthContext";

const ModalImportarProducto = ({ visible, onClose, onImportado }) => {
  const { token } = useAuth();

  const [archivo, setArchivo] = useState(null);
  const inputArchivoRef = useRef();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setArchivo(file);
    } else {
      toast.error("Debes subir un archivo .xlsx válido.");
    }
  };
  const handleSeleccionArchivo = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setArchivo(file);
    } else {
      toast.error("Debes subir un archivo .xlsx válido.");
    }
  };
  
  const handleSubmit = async () => {
    if (!archivo) return toast.error("Selecciona un archivo primero.");
    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      await importarProductosExcel(token,formData);
      toast.success("Productos importados correctamente");
      onClose();
      onImportado();
    } catch (err) {
      console.error(err)
      const mensaje = await err.response?.text?.() || "Error al importar";
      toast.error(mensaje);
    }
  };

  const handleDescargarPlantilla = async () => {
    try {
      const blob = await descargarPlantillaExcel(token);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla_productos.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toast.error("No se pudo descargar la plantilla.");
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
          style={{ width: "420px", borderRadius: "20px", textAlign: "center" }}
        >
          <h5 className="fw-bold mb-3 d-flex justify-content-center align-items-center gap-2">
            <BiUpload size={22} /> Importar productos
          </h5>

          <div
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
  onClick={() => inputArchivoRef.current.click()} // 🔹 NUEVO
  style={{
    border: "2px dashed #ccc",
    padding: "40px 20px",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
  }}
>
  {archivo ? (
    <span className="fw-bold text-success">{archivo.name}</span>
  ) : (
    <span className="text-muted">
      Arrastra o haz clic para seleccionar un archivo Excel (.xlsx)
    </span>
  )}
  <input
    type="file"
    accept=".xlsx"
    hidden
    ref={inputArchivoRef}
    onChange={handleSeleccionArchivo} // 🔹 NUEVO
  />
</div>


          <div className="d-flex justify-content-between gap-2 mt-4">
            <button
              className="btn"
              style={{
                backgroundColor: "#ff5c00",
                borderColor: "#ff5c00",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#C74900";
                e.target.style.borderColor = "#C74900";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#ff5c00";
                e.target.style.borderColor = "#ff5c00";
              }}
              onClick={handleDescargarPlantilla}
            >
              <BiDownload className="me-1" />
              Plantilla
            </button>
            <div className="d-flex gap-2">
              <button
                className="btn text-white"
                style={{ backgroundColor: "#6c757d" }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: "#ff5c00",
                  borderColor: "#ff5c00",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#C74900";
                  e.target.style.borderColor = "#C74900";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ff5c00";
                  e.target.style.borderColor = "#ff5c00";
                }}
                onClick={handleSubmit}
              >
                Importar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalImportarProducto;
