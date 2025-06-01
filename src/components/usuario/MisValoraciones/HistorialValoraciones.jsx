import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { obtenerValoracionesPorUsuario } from "../../../services/valoracionesService";
import EstrellasValoracion from "../../valoracion/EstrellasValoracion";

const HistorialValoraciones = () => {
  const { user } = useAuth();
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const cargarValoraciones = async () => {
      try {
        const data = await obtenerValoracionesPorUsuario(user.id);
        setValoraciones(data);
      } catch (e) {
        setError("No se pudieron cargar las valoraciones.");
      }
    };

    cargarValoraciones();
  }, [user]);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">Mis valoraciones</h4>

      {valoraciones.length === 0 ? (
        <p>No has realizado ninguna valoración aún.</p>
      ) : (
        <ul className="list-group">
          {valoraciones.map((valoracion, i) => (
            <li
            key={i}
            className="list-group-item mb-3 border border-1 bg-white"
            style={{
              borderRadius: "10px",
              padding: "1rem",
            }}
          >
            <div className="d-flex align-items-center gap-3" style={{ minHeight: 80, justifyContent:"center" }}>
              
              {/* Imagen - 20% */}
              <div style={{ flexBasis: "20%", maxWidth: "20%" }}>
                <img
                  src={valoracion.imagenProducto}
                  alt="Producto"
                  style={{
                    width: "100%",
                    height: 80,
                    objectFit: "contain",
                    borderRadius: 6,
                  }}
                />
                
              </div>
          
              {/* Comentario - 60% */}
              <div className="text-center"
                style={{
                  flexGrow: 1,
                  maxWidth: "60%",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                <p className="mb-0 text-muted">{valoracion.comentario}</p>
              </div>
          
              {/* Estrellas - 20% */}
              <div
                className="text-center"
                style={{
                  flexBasis: "20%",
                  maxWidth: "20%",
                  fontSize: "1.5rem",
                  color: "#ff5c00",
                  whiteSpace: "nowrap",
                }}
              >
                <EstrellasValoracion media={valoracion.puntuacion} />
              </div>
            </div>
          </li>
          
          
          
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialValoraciones;
