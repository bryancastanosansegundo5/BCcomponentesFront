import { useEffect, useState } from "react";
import { obtenerRecomendaciones } from "../../services/productoService";
import Cookies from "js-cookie";

const Recomendaciones = ({ usuarioId, onProductoClick }) => {
  const [similares, setSimilares] = useState([]);
  const [complementarios, setComplementarios] = useState([]);

  useEffect(() => {
    const idsGuardados = Cookies.get(`historial_${usuarioId || "anonimo"}`);
    const productoIds = idsGuardados ? JSON.parse(idsGuardados) : [];

    obtenerRecomendaciones(productoIds, usuarioId)
      .then((data) => {
        
        setSimilares(data.similares || []);
        setComplementarios(data.complementarios || []);
      })
      .catch((err) => {
        console.error("❌ Error cargando recomendaciones:", err);
      });
  }, [usuarioId]);

  const renderCard = (producto) => (
    <div
      className="card-producto"
      key={producto.id}
      onClick={() => onProductoClick?.(producto.id)}
      style={{ cursor: "pointer" }}
    >
      <img src={producto.imagen} alt={producto.nombre} />
      <h6>{producto.nombre}</h6>
      <strong>{producto.precio} €</strong>
    </div>
  );

  return (
    <>
      {similares.length > 0 && (
        <section className="bloque-recomendaciones">
          <h2 className="titulo-seccion">Basado en tu navegación</h2>
          <div className="productos-scroll">
            {similares.map(renderCard)}
          </div>
        </section>
      )}
      {complementarios.length > 0 && (
        <section className="bloque-recomendaciones">
          <h2 className="titulo-seccion">Te puede interesar</h2>
          <div className="productos-scroll">
            {complementarios.map(renderCard)}
          </div>
        </section>
      )}
    </>
  );
};

export default Recomendaciones;
