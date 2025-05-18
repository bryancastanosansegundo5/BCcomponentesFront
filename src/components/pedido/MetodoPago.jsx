import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePedidoStore } from "../../store/pedidoStore";
import { useCarritoStore } from "../../store/carritoStore";
import { enviarPedido } from "../../services/pedidoService";
import { crearPedidoPaypal, capturarPedidoPaypal } from "../../services/paypalService";
import "./cesta.css";
import {
  obtenerUsuarioPorId,
  actualizarUsuario,
} from "../../services/authService";
import ResumenPedido from "./ResumenPedido";
import BarraProgresoPedido from "./BarraProgresoPedido";
import { useAuth } from "../../context/AuthContext";
import ModalSinStock from "./sinStock/ModalSinStock";
import { SERVIDOR_BASE_URL } from '@/utils/config';

const MetodoPago = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const metodoPago = usePedidoStore((state) => state.pedido.metodoPago);
  const setMetodoPago = usePedidoStore((state) => state.setMetodoPago);
  const setDatosTarjeta = usePedidoStore((state) => state.setDatosTarjeta);
  const setNumFactura = usePedidoStore((state) => state.setNumFactura);
  const pedido = usePedidoStore((state) => state.pedido);
  const carrito = useCarritoStore((state) => state.carrito);
  const productos = useCarritoStore((state) => state.productos);

  const [numero, setNumero] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [codigoSeguridad, setCodigoSeguridad] = useState("");
  const [titular, setTitular] = useState("");
  const [guardar, setGuardar] = useState(false);
  const [pasoActual, setPasoActual] = useState(4);
  const [mostrarModalSinStock, setMostrarModalSinStock] = useState(false);

  useEffect(() => {
    const cargarTarjeta = async () => {
      const usuario = await obtenerUsuarioPorId(user.id);
      if (!usuario) return;

      if (
        usuario.numeroTarjeta ||
        usuario.fechaExpiracion ||
        usuario.codigoSeguridad ||
        usuario.titularTarjeta
      ) {
        setNumero(usuario.numeroTarjeta || "");
        setFechaExpiracion(usuario.fechaExpiracion || "");
        setCodigoSeguridad(usuario.codigoSeguridad || "");
        setTitular(usuario.titularTarjeta || "");
        setGuardar(true);
      }
    };

    if (metodoPago === "TARJETA") {
      cargarTarjeta();
    } else {
      setNumero("");
      setFechaExpiracion("");
      setCodigoSeguridad("");
      setTitular("");
      setGuardar(false);
    }
  }, [metodoPago]);
  useEffect(() => {
    if (
      metodoPago === "PAYPAL" &&
      window.paypal &&
      carrito &&
      Object.keys(carrito).length > 0
    ) {
      const total = Object.entries(carrito).reduce(
        (acc, [id, cantidad]) => acc + productos[id].precio * cantidad,
        0
      );
// Limpiar botones previos si existen
const container = document.getElementById("paypal-button-container");
if (container) container.innerHTML = "";
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            return await crearPedidoPaypal(total);
          } catch (err) {
            console.error("❌ Error al crear pedido PayPal:", err);
            return null;
          }
        },
        onApprove: async (data) => {
          const productosPedido = Object.entries(carrito).map(
            ([id, cantidad]) => ({
              idProducto: parseInt(id),
              cantidad,
              precio: productos[id].precio,
              subtotal: productos[id].precio * cantidad,
              nombre: productos[id].nombre,
              imagen: productos[id].imagen,
            })
          );

          const pedidoFinal = {
            ...pedido,
            productos: productosPedido,
            total,
          };

          try {
            const { numFactura } = await capturarPedidoPaypal(
              data.orderID,
              pedidoFinal,
              user.id
            );
            setNumFactura(numFactura);
            useCarritoStore.getState().resetCarritoStore();
            navigate("/resumen");
          } catch (err) {
            console.error("❌ Error al capturar pedido PayPal:", err);
            if (err.message.includes("stock")) {
              setMostrarModalSinStock(true);
            }
          }
        },
        onError: (err) => {
          console.error("❌ Error PayPal:", err);
        },
      }).render("#paypal-button-container");
      
    }
  }, [metodoPago, carrito, productos]);

  const manejarContinuar = async ({ total }) => {
    if (metodoPago === "TARJETA" && guardar) {
      setDatosTarjeta({
        numero,
        fechaExpiracion,
        codigoSeguridad,
        titular,
        guardar,
      });
      await actualizarUsuario(user.id, {
        numeroTarjeta: numero,
        fechaExpiracion,
        codigoSeguridad,
        titularTarjeta: titular,
      });
    } else {
      setDatosTarjeta(null);
    }

    const productosPedido = Object.entries(carrito).map(([id, cantidad]) => ({
      idProducto: parseInt(id),
      cantidad,
      precio: productos[id].precio,
      subtotal: productos[id].precio * cantidad,
      nombre: productos[id].nombre,
      imagen: productos[id].imagen,
    }));

    const pedidoFinal = {
      ...pedido,
      productos: productosPedido,
      total
    };

    try {
      const { numFactura } = await enviarPedido(pedidoFinal, user.id);
      setNumFactura(numFactura);
      useCarritoStore.getState().resetCarritoStore();
      navigate("/resumen");
    } catch (error) {
      console.error("❌ Error al enviar pedido:", error.message);
      if (error.message.includes("stock")) {
        setMostrarModalSinStock(true);
      }
    }
  };

  const seleccionarMetodoPago = (metodo) => setMetodoPago(metodo);
  const metodoSeleccionado = (metodo) => metodoPago === metodo;

  // ✅ Validación para activar el botón
  const metodoTarjetaValido =
    metodoPago !== "TARJETA" ||
    (numero.trim() &&
      fechaExpiracion.trim() &&
      codigoSeguridad.trim() &&
      titular.trim());

  return (
    <div className="container my-4" >
      <BarraProgresoPedido
        pasoActivo={pasoActual}
        onPasoClick={(nuevoPaso) => {
          setPasoActual(nuevoPaso);

          if (nuevoPaso === 1) navigate("/cesta");
          if (nuevoPaso === 2) navigate("/formularioDireccion");
          if (nuevoPaso === 3) navigate("/opcionesEntrega");
          if (nuevoPaso === 4) navigate("/pago");
        }}
      />

      <h4 className="fw-bold mb-4">Método de pago</h4>

      <div className="row">
        <div className="col-md-8">
          {/* Tarjeta */}
          <label
            className={`d-flex justify-content-between align-items-center p-3 border rounded mb-3 ${metodoSeleccionado("TARJETA") ? "border-warning bg-light" : ""
              }`}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input me-3"
                checked={metodoSeleccionado("TARJETA")}
                onChange={() => seleccionarMetodoPago("TARJETA")}
              />
              <strong>Tarjeta de crédito o débito</strong>
            </div>
            <div>
              <img
                src={`${SERVIDOR_BASE_URL}img/logosPagos/visa.png`}
                alt="visa"
                style={{ width: 40, height: 24, objectFit: "contain" }}
              />
              <img
                src={`${SERVIDOR_BASE_URL}img/logosPagos/mastercard.png`}
                alt="mc"
                style={{ height: 24, objectFit: "contain" }}
              />
            </div>
          </label>

          {metodoSeleccionado("TARJETA") && (
            <div className="border rounded p-3 mb-3">
              <div className="mb-2">
                <label className="form-label">Número de tarjeta</label>
                <input
                  className="form-control"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="row mb-2">
                <div className="col">
                  <label className="form-label">Fecha de expiración</label>
                  <input
                    className="form-control"
                    placeholder="MM/AA"
                    value={fechaExpiracion}
                    onChange={(e) => setFechaExpiracion(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label className="form-label">Código de seguridad</label>
                  <input
                    className="form-control"
                    placeholder="3 dígitos"
                    value={codigoSeguridad}
                    onChange={(e) => setCodigoSeguridad(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Titular de la tarjeta</label>
                <input
                  className="form-control"
                  value={titular}
                  onChange={(e) => setTitular(e.target.value)}
                />
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="guardarTarjeta"
                  checked={guardar}
                  onChange={(e) => setGuardar(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="guardarTarjeta">
                  Guardar para futuras compras
                </label>
              </div>
            </div>
          )}

          {/* Paypal */}
          <label
            className={`d-flex justify-content-between align-items-center p-3 border rounded mb-3 ${metodoSeleccionado("PAYPAL") ? "border-warning bg-light" : ""
              }`}
            style={{ cursor: "pointer" }}
          >


            <div className="d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input me-3"
                checked={metodoSeleccionado("PAYPAL")}
                onChange={() => seleccionarMetodoPago("PAYPAL")}
              />
              <strong>PayPal</strong>
            </div>
            <img
              src={`${SERVIDOR_BASE_URL}img/logosPagos/paypal.png`}
              alt="paypal"
              style={{ height: 24, objectFit: "contain" }}
            />
          </label>
          {metodoSeleccionado("PAYPAL") && (
            <div id="paypal-button-container" className="my-3"  />
          )}
          {/* Bizum */}
          <label
            className={`d-flex justify-content-between align-items-center p-3 border rounded mb-3 ${metodoSeleccionado("BIZUM") ? "border-warning bg-light" : ""
              }`}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input me-3"
                checked={metodoSeleccionado("BIZUM")}
                onChange={() => seleccionarMetodoPago("BIZUM")}
              />
              <strong>Bizum</strong>
            </div>
            <img
              src={`${SERVIDOR_BASE_URL}img/logosPagos/bizum.png`}
              alt="bizum"
              style={{ height: 24, objectFit: "contain" }}
            />
          </label>

          {/* Transferencia */}
          <label
            className={`d-flex justify-content-between align-items-center p-3 border rounded mb-3 ${metodoSeleccionado("TRANSFERENCIA")
              ? "border-warning bg-light"
              : ""
              }`}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input me-3"
                checked={metodoSeleccionado("TRANSFERENCIA")}
                onChange={() => seleccionarMetodoPago("TRANSFERENCIA")}
              />
              <strong>Transferencia ordinaria</strong>
            </div>
            <img
              src={`${SERVIDOR_BASE_URL}img/logosPagos/transferencia2.png`}
              alt="transferencia"
              style={{ height: 24, objectFit: "contain" }}
            />
          </label>
        </div>

        <div className="col-md-4">
          <ResumenPedido
            mostrarBoton={!!metodoPago && metodoTarjetaValido && metodoPago !== "PAYPAL"}
            textoBoton="Confirmar pedido"
            onContinuar={manejarContinuar}
          />

        </div>
      </div>
      <ModalSinStock visible={mostrarModalSinStock} onCerrar={() => setMostrarModalSinStock(false)} />

    </div>

  );
};

export default MetodoPago;
