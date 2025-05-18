import { useEffect, useState } from "react";
import { usePedidoStore } from "../../store/pedidoStore";
import BarraProgresoPedido from "./BarraProgresoPedido";
import {
  obtenerResumenPedidoCompleto,
  obtenerFactura,
} from "../../services/pedidoService";
import { useCarritoStore } from "../../store/carritoStore";
import { getColorEstado } from "../../utils/configuracionUI";
import { useAuth } from "../../context/AuthContext";

const ResumenPedidoFinal = () => {
  const { numFactura } = usePedidoStore((state) => state.pedido);
  const carrito = useCarritoStore((state) => state.carrito);

  const resetCarritoStore = useCarritoStore((state) => state.resetCarritoStore);
  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);
  const resetPedidoStore = usePedidoStore((state) => state.resetPedido);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [factura, setFactura] = useState("");
  const { user } = useAuth();

  const manejarDescargaFactura = async () => {
    try {
      const blob = await obtenerFactura(user.id, factura);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${factura}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("No se pudo descargar la factura.");
    }
  };
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const datos = await obtenerResumenPedidoCompleto(numFactura);

        setResumen(datos);
      } catch (error) {
        console.error("❌ Error al cargar pedido:", error);
      } finally {
        setCargando(false);
      }
    };

    if (numFactura) {
      console.log(numFactura);

      setFactura(numFactura);
      fetchPedido().then(async () => {
        await vaciarCarrito()
        resetCarritoStore();
        resetPedidoStore();

      });
    }
  }, [numFactura]);

  if (cargando) return <p>Cargando resumen del pedido...</p>;
  if (!resumen) return <p>No se pudo cargar el pedido.</p>;

  const { datos, productos } = resumen;

  return (
    <>
      <BarraProgresoPedido pasoActivo={5} bloqueado />
      <div className="container my-4">
        <h4 className="fw-bold mt-4 mb-3 text-start">Detalles del pedido</h4>

        <div
          className="d-flex justify-content-between mb-3 pb-4"
          style={{ borderBottom: "2px dashed #ccc" }}
        >
          <span>Comprado el {new Date(datos.fecha).toLocaleDateString()}</span>
          <br />
          <span>Nº Factura: {factura}</span>
          <div className="text-end">
            <div>
              Estado:{" "}
              <span
                className="fw-semibold"
                style={{ color: getColorEstado(datos.estado) }}
              >
                {datos.estado}
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: "0.9rem" }}>
              Entrega prevista:{" "}
              <strong>
                {new Date(datos.fechaEntregaUsuario).toLocaleDateString()}
              </strong>
            </div>
          </div>
        </div>

        <div
          className="row mb-4 pb-4"
          style={{ borderBottom: "2px dashed #ccc" }}
        >
          <div className="col-md-4 text-start">
            <h6 className="fw-bold">Dirección de envío</h6>
            <p className="mb-1">
              {datos.nombre} {datos.apellidos}
            </p>
            <p className="mb-1">{datos.direccion}</p>
            <p className="mb-1">
              {datos.poblacion}, {datos.provincia}
            </p>
            <p className="mb-1">{datos.pais}</p>
            <p className="mb-1">{datos.telefono}</p>
          </div>

          <div className="col-md-4 text-start">
            <h6 className="fw-bold">Método de pago</h6>
            <p className="mb-1">Pago con {datos.metodoPago}</p>
            <h6 className="fw-bold mt-3">Transportista</h6>
            <p className="mb-1">{datos.transportista}</p>
          </div>

          <div className="col-md-4 text-start">
            <h6 className="fw-bold">Resumen de pedido</h6>
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{datos.total.toFixed(2)} €</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>{datos.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-end">
          <button
            className="btn text-white border-0"
            style={{ backgroundColor: "#ff5c00" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
            onClick={manejarDescargaFactura}
          >
            Descargar factura
          </button>
        </div>

        <div>
          {productos.map((p) => (
            <div
              key={p.id}
              className="d-flex align-items-center border p-3 rounded mb-2"
            >
              <img
                src={`${p.imagen}`}
                alt={p.nombre}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  marginRight: 20,
                }}
              />
              <div className="flex-grow-1 text-start">
                <div className="fw-bold">{p.nombre}</div>
                <small className="text-muted">Cantidad: {p.cantidad}</small>
              </div>
              <div className="text-end">
                <div className="fw-bold">{p.subtotal} €</div>
                <small className="text-muted">Unidad: {p.precio} €</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResumenPedidoFinal;
