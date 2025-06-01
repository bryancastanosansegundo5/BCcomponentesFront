import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecomendacionesStore } from "../../../store/recomendacionesStore";
import { obtenerPorIds } from "../../../services/productoService";
import DetalleProducto from "../../catalogo/DetalleProducto";

const RecomendacionProductos = ({estadoRevision, problemasRevision }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);



  const cerrarRecomendaciones = useRecomendacionesStore(
    (state) => state.cerrar
  );
  const setProductosRecomendados = useRecomendacionesStore(
    (state) => state.setProductosRecomendados
  );
  const actualizarProductosRecomendados = useRecomendacionesStore(
    (state) => state.actualizarProductos
  );
  const productosRecomendados = useRecomendacionesStore((state) => state.productosRecomendados); // 👈 aquí lo cogemos directamente

  useEffect(() => {
    setProductosRecomendados(productosRecomendados);
  }, [productosRecomendados, setProductosRecomendados]);

  useEffect(() => {
    const cargarDatosFaltantes = async () => {
      const idsIncompletos = productosRecomendados
        .filter((p) => !p.nombre || !p.imagen || !p.precio)
        .map((p) => p.id);

      if (idsIncompletos.length > 0) {
        const productosCompletos = await obtenerPorIds(idsIncompletos);
        actualizarProductosRecomendados(productosCompletos);
      }
    };

    cargarDatosFaltantes();
  }, [productosRecomendados, actualizarProductosRecomendados]);

 

  
  
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);
  return (
    <motion.div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ pointerEvents: "none", zIndex: 2001 }} // uno por encima del nuevo fondo
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <motion.div
        className="d-flex flex-wrap justify-content-center align-items-center"
        style={{
          position: "absolute",
          top: "50px",
          left: "0",
          right: "370px",
          margin: "0 auto",
          gap: "30px",
          padding: "20px",
          pointerEvents: "auto",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: "-100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="w-100 mb-3" style={{ position: "relative" }}>
          <div
            className="d-flex align-items-center w-100"
            style={{ position: "relative", padding: "0 20px" }}
          >
            <div
              className="mx-auto"
              style={{
                padding: "10px 20px",
                backgroundColor:
                  estadoRevision === "compatible" ? "#d4edda" : "#fff3cd",
                color: estadoRevision === "compatible" ? "#155724" : "#856404",
                border: `1px solid ${
                  estadoRevision === "compatible" ? "#c3e6cb" : "#ffeeba"
                }`,
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "14px",
                textAlign: "center",
                minWidth: "250px",
                maxWidth: "400px",
              }}
            >
              {estadoRevision === "compatible"
                ? "✅ Todos los productos son compatibles."
                : "⚠️ Se detectaron incompatibilidades."}
            </div>
            <button
              onClick={cerrarRecomendaciones}
              className="btn btn-sm position-absolute"
              style={{
                top: "50%",
                right: "30px",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "white",
                border: "2px solid #ff5c00",
                color: "#ff5c00",
                fontWeight: "bold",
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
            >
              ✕
            </button>
          </div>

          {problemasRevision && problemasRevision.length > 0 && (
            <div
              className="w-100 p-3 mb-3 mt-3"
              style={{
                backgroundColor: "#fff",
                border: "2px solid #ff5c00",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
                {problemasRevision.map((problema, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "8px",
                      color: "#ff5c00",
                      fontSize: "14px",
                    }}
                  >
                    {problema}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {productosRecomendados.map((producto, index) => (
          <motion.div
            key={index}
            onClick={() => setProductoSeleccionado(producto.id)}
            className="d-flex flex-column align-items-center justify-content-between p-3"
            style={{
              width: "180px",
              height: "260px",
              cursor: "pointer",
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            <div className="fw-bold mb-2" style={{ fontSize: "14px" }}>
              {producto.nombre}
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: "bold", color: "#ff5c00" }}
            >
              {producto.precio ? producto.precio.toFixed(2) + "€" : ""}
            </div>
          </motion.div>
        ))}
      </motion.div>
      {productoSeleccionado && (
        <DetalleProducto
          idProducto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          modoCompacto={true}
        />
      )}
    </motion.div>
  );
};

export default RecomendacionProductos;
