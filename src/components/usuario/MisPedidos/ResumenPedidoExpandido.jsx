import { MdDownload } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";

import {
  obtenerFactura,
} from "../../../services/pedidoService";

const ResumenPedidoExpandido = ({ resumen,numFactura }) => {
  if (!resumen) return null;
    const { user } = useAuth();
  
  const manejarDescargaFactura = async () => {
    try {
      const blob = await obtenerFactura(user.id, numFactura);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${numFactura}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("No se pudo descargar la factura.");
    }
  };

  return (
    <div className="mt-4 border-top pt-3 text-start">
      {/* Detalles */}
      <div className="row mb-3">
        <div className="col">
          <h6>
            <strong>Dirección de envío</strong>
          </h6>
          <p className="mb-1">
            {resumen.datos.nombre} {resumen.datos.apellidos}
          </p>
          <p className="mb-1">{resumen.datos.direccion}</p>
          <p className="mb-1">
            {resumen.datos.codigoPostal}, {resumen.datos.poblacion}
          </p>
          <p className="mb-1">
            {resumen.datos.provincia}, {resumen.datos.pais}
          </p>
          <p className="mb-1">{resumen.datos.telefono}</p>
        </div>

        <div className="col">
          <h6>
            <strong>Método de pago</strong>
          </h6>
          <p className="mb-1">Pago con {resumen.datos.metodoPago}</p>

          <h6 className="mt-3">
            <strong>Transportista</strong>
          </h6>
          <p className="mb-1">{resumen.datos.transportista}</p>
        </div>

        <div className="col">
          <h6>
            <strong>Resumen de pedido</strong>
          </h6>
          <div className="d-flex justify-content-between">
            <span>Subtotal</span>
            <span>{resumen.datos.subtotal.toFixed(2)} €</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>{resumen.datos.total.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn text-white"
          style={{
            backgroundColor: "#ff5c00",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
          onClick={manejarDescargaFactura}
        >
          <MdDownload className="me-1" size={20} />
          Descargar factura
        </button>
      </div>

      <div className="list-group">
        {resumen.productos.map((prod) => (
          <div
            key={prod.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={prod.imagen}
                alt={prod.nombre}
                style={{ width: 50, height: 50, objectFit: "contain" }}
              />
              <div>
                <div className="fw-bold">{prod.nombre}</div>
                <div className="text-muted">Cantidad: {prod.cantidad}</div>
              </div>
            </div>
            <div className="fw-bold">{prod.precio.toFixed(2)} €</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumenPedidoExpandido;
