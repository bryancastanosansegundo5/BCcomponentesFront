import { useEffect, useState } from "react";
import { obtenerValoracionesPorProducto } from "../../services/valoracionesService"; // Asegúrate de tenerlo
import { MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";
import EstrellasValoracion from "../valoracion/EstrellasValoracion";

const ComentariosProducto = ({ productoId }) => {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const data = await obtenerValoracionesPorProducto(productoId);
        console.log(data);

        setComentarios(data);
      } catch (error) {
        console.error("❌ Error al cargar comentarios:", error);
      }
    };
    if (productoId) cargarComentarios();
  }, [productoId]);



  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">Opiniones de clientes</h5>
      {comentarios.length === 0 ? (
        <p className="text-muted">Este producto todavía no tiene valoraciones.</p>
      ) : (
        comentarios.map((comentario, i) => (
          <div key={i} className="mb-4 p-3" style={{
            border: "1px solid #ff5c00",
            borderRadius: "12px",
          }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ color: "#ff5c00" }}> {comentario.emailUsuario}</span>
              <div style={{ color: "#ff5c00" }}>
                <EstrellasValoracion media={comentario.puntuacion} total={-1} />
              </div>
            </div>

            <strong className="mb-0 text-dark">{comentario.comentario}</strong>
          </div>
        ))
      )}
    </div>
  );
};

export default ComentariosProducto;
