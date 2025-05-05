import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { obtenerPedidosPorUsuario, obtenerResumenPedidoCompleto } from "../../../services/pedidoService";
import ResumenPedidoExpandido from "./ResumenPedidoExpandido";
import { getColorEstado } from "../../../utils/configuracionUI";

const HistorialPedidos = () => {
  const { user: usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario?.id) return;

    const cargarPedidos = async () => {
      try {
        const datos = await obtenerPedidosPorUsuario(usuario.id);
        setPedidos(datos);
      } catch (e) {
        setError("No se pudieron cargar los pedidos.");
      }
    };

    cargarPedidos();
  }, [usuario]);

  const togglePedido = async (numFactura) => {
    if (pedidoActivo?.numFactura === numFactura) {
      setPedidoActivo(null);
      return;
    }

    try {
      const resumen = await obtenerResumenPedidoCompleto(numFactura);
      setPedidoActivo({ numFactura, resumen });
    } catch (e) {
      setError("No se pudo cargar el resumen del pedido.");
    }
  };

  if (error) return <p className="text-danger">{error}</p>;
console.log(pedidos);

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">Mis pedidos</h4>

      {pedidos.length === 0 ? (
        <p>No hay pedidos realizados.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li
              key={pedido.numFactura}
              className={`list-group-item mb-3 border border-1 ${pedidoActivo?.numFactura === pedido.numFactura ? "border-warning shadow-sm" : ""}`}
              style={{
                borderRadius: "10px",
                boxShadow: pedidoActivo?.numFactura === pedido.numFactura ? "0 0 10px 3px rgba(255, 92, 0, 0.5)" : "",
                transition: "all 0.3s ease",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => togglePedido(pedido.numFactura)}
              >
                {/* Columna 1: Imágenes */}
                <div style={{ width: "33%" }} className="d-flex gap-2 align-items-center">
                  {pedido.imagenesProductos?.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Producto ${i}`}
                      style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 6, marginRight: 4 }}
                    />
                  ))}
                </div>

                {/* Columna 2: Detalles */}
                <div style={{ width: "49%" }} className="text-start">
                  <div className="row">
                    <div className="col-6"><strong>Factura: </strong>{pedido.numFactura}</div>
                    <div className="col-6"><strong>Fecha: </strong>{new Date(pedido.fecha).toLocaleDateString()}</div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Estado: </strong>
                      <span className="fw-semibold" style={{ color: getColorEstado(pedido.estado) }}>{pedido.estado}</span>
                    </div>
                    <div className="col-6">
                      <strong>Entrega: </strong>
                      {new Date(pedido.fechaEntregaUsuario).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Columna 3: Total */}
                <div style={{ width: "20%" }} className="fw-bold text-end">
                  {pedido.total.toFixed(2)} €
                </div>
              </div>

              {pedidoActivo?.numFactura === pedido.numFactura && (
                <ResumenPedidoExpandido resumen={pedidoActivo.resumen} numFactura={pedidoActivo.numFactura} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialPedidos;
