import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  obtenerPedidosPorUsuario,
  obtenerResumenPedidoCompleto,
} from "../../../services/pedidoService";
import { guardarValoracion } from "../../../services/valoracionesService";
import ModalValoracion from "../MisValoraciones/ModalValoracion";

import { obtenerPedidosParaAdmin } from "../../../services/empleadoService";
import ResumenPedidoExpandido from "./ResumenPedidoExpandido";
import { getColorEstado } from "../../../utils/configuracionUI";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const HistorialPedidos = () => {
  const location = useLocation();

  const { user: usuario, token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productoParaValorar, setProductoParaValorar] = useState(null);
  useEffect(() => {
    if (!usuario?.id) return;

    const cargarPedidos = async () => {
      try {
        const datos = location.pathname.startsWith("/empleado")
          ? await obtenerPedidosParaAdmin(token)
          : await obtenerPedidosPorUsuario(usuario.id);

        setPedidos(datos);
      } catch (e) {
        setError("No se pudieron cargar los pedidos.");
      }
    };

    cargarPedidos();
  }, [usuario, token]);

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
  const handleValorar = (detalleId) => {

    setProductoParaValorar(detalleId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setProductoParaValorar(null);
  };

  const onValorarSubmit = async (dto) => {
    try {
      await guardarValoracion(dto);
      closeModal();

      // 🔁 Recargar el pedido activo para que desaparezca el botón tras valorar
      if (pedidoActivo?.numFactura) {
        const resumen = await obtenerResumenPedidoCompleto(
          pedidoActivo.numFactura
        );
        setPedidoActivo({ numFactura: pedidoActivo.numFactura, resumen });
      }

      toast.success("Valoración enviada correctamente");
    } catch (e) {
      const mensaje = typeof e?.message === "string" ? e.message : "Error al enviar valoración";
      toast.error(mensaje);

    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <h4 className="fw-bold mb-4 border-bottom pb-2">
        {usuario.rolId > 1 && location.pathname.startsWith("/empleado")
          ? "Pedidos (Administración)"
          : "Mis pedidos"}
      </h4>

      {pedidos.length === 0 ? (
        <p>No hay pedidos realizados.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li
              key={pedido.numFactura}
              className={`list-group-item mb-3 border border-1 ${pedidoActivo?.numFactura === pedido.numFactura
                  ? "border-warning shadow-sm"
                  : ""
                }`}
              style={{
                borderRadius: "10px",
                boxShadow:
                  pedidoActivo?.numFactura === pedido.numFactura
                    ? "0 0 10px 3px rgba(255, 92, 0, 0.5)"
                    : "",
                transition: "all 0.3s ease",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => togglePedido(pedido.numFactura)}
              >
                <div
                  style={{ width: "33%" }}
                  className="d-flex gap-2 align-items-center"
                >
                  {pedido.imagenesProductos?.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Producto ${i}`}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        borderRadius: 6,
                        marginRight: 4,
                      }}
                    />
                  ))}
                </div>

                <div style={{ width: "49%" }} className="text-start">
                  <div className="row">
                    <div className="col-6">
                      <strong>Factura: </strong>
                      {pedido.numFactura}
                    </div>
                    <div className="col-6">
                      <strong>Fecha: </strong>
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Estado: </strong>
                      <span
                        className="fw-semibold"
                        style={{ color: getColorEstado(pedido.estado) }}
                      >
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="col-6">
                      <strong>Entrega: </strong>
                      {new Date(
                        pedido.fechaEntregaUsuario
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ width: "20%" }} className="fw-bold text-end">
                  {pedido.total.toFixed(2)} €
                </div>
              </div>

              {pedidoActivo?.numFactura === pedido.numFactura && (
                <ResumenPedidoExpandido
                  resumen={pedidoActivo.resumen}
                  numFactura={pedidoActivo.numFactura}
                  handleValorar={handleValorar}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {modalOpen && (
        <ModalValoracion
          visible={modalOpen}
          detalleId={productoParaValorar}
          usuarioId={usuario.id}
          onClose={closeModal}
          onSubmit={onValorarSubmit}
        />
      )}
    </div>
  );
};

export default HistorialPedidos;
