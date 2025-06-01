import { useEffect, useState } from "react";
import { useCarritoStore } from "../../store/carritoStore";
import { usePedidoStore } from "../../store/pedidoStore";
import { obtenerTransportistas } from "../../services/pedidoService";
import ResumenPedido from "./ResumenPedido";
import BarraProgresoPedido from "./BarraProgresoPedido";
import { useNavigate } from "react-router-dom";
import { SERVIDOR_BASE_URL } from '@/utils/config';

const OpcionesEntrega = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [pasoActual, setPasoActual] = useState(3);

  const carrito = useCarritoStore((state) => state.carrito);
  const productos = useCarritoStore((state) => state.productos);

  const transportistaSeleccionado = usePedidoStore(
    (state) => state.pedido.transportista
  );
  const setTransportista = usePedidoStore((state) => state.setTransportista);

  const fechaEntregaUsuario = usePedidoStore((state) => state.pedido.fechaEntregaUsuario);

  const setFechaEntregaUsuario = usePedidoStore((state) => state.setFechaEntregaUsuario);
  const pedido = usePedidoStore((state) => state.pedido);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerTransportistas().then(setTransportistas);

    const hoy = new Date();
    const fechas = [];

    // Empezamos desde hoy + 2
    for (let i = 2; i < 7; i++) {
      const nueva = new Date();
      nueva.setDate(hoy.getDate() + i);
      fechas.push(nueva.toISOString().split("T")[0]);
    }

    setFechasDisponibles(fechas);
    setFechaEntregaUsuario(fechas[0]); // seleccionamos la más próxima por defecto
  }, []);

  return (
    <>
      <BarraProgresoPedido
        pasoActivo={pasoActual}
        onPasoClick={(nuevoPaso) => {
          setPasoActual(nuevoPaso);

          if (nuevoPaso === 1) navigate("/cesta");
          if (nuevoPaso === 2) navigate("/formularioDireccion");
          if (nuevoPaso === 3) navigate("/envio");
          
        }}
      />
      <div className="container my-4" >
        <div className="row">
          {/* === COLUMNA 1: PRODUCTOS === */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">Artículos en tu pedido</h5>
            {Object.entries(carrito).map(([id, cantidad]) => {
              const producto = productos[id];
              if (!producto) return null;

              return (
                <div
                  key={id}
                  className="d-flex align-items-center mb-2 border-bottom pb-2"
                >
                  <img
                    src={`${producto.imagen}`}
                    alt={producto.nombre}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <strong>{producto.nombre}</strong>
                    <div style={{ fontSize: "0.9rem" }}>
                      {cantidad} ud. · {producto.precio.toFixed(2)}€
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* === COLUMNA 2: OPCIONES DE ENVÍO === */}
          <div
            className="col-md-4"
            style={{
              borderLeft: "2px dashed #ccc",
              paddingLeft: "24px",
            }}
          >
            <h5 className="fw-bold mb-3">Opciones de envío</h5>

            <select
              className="form-select mb-4"
              value={fechaEntregaUsuario || ""}
              onChange={(e) => setFechaEntregaUsuario(e.target.value)}
            >
              {/* <option disabled value="">Selecciona fecha</option> */}
              {fechasDisponibles.map((fecha) => (
                <option key={fecha} value={fecha}>
                  {new Date(fecha).toLocaleDateString()}
                </option>
              ))}
            </select>

            {transportistas.map((nombre) => {
              const seleccionado = transportistaSeleccionado === nombre;

              return (
                <label
                  key={nombre}
                  className={`border rounded p-2 d-flex align-items-center mb-2 ${
                    seleccionado ? "border-warning bg-light" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="transportista"
                    value={nombre}
                    checked={seleccionado}
                    onChange={() => setTransportista(nombre)}
                    className="form-check-input me-3"
                  />
                  <img
                    src={`${SERVIDOR_BASE_URL}img/logosTransportistas/${nombre.toLowerCase()}.svg`}
                    alt={nombre}
                    style={{
                      width: 40,
                      height: 30,
                      objectFit: "contain",
                      marginRight: "1rem",
                    }}
                  />
                  <span>{nombre}</span>
                </label>
              );
            })}
          </div>

          {/* === COLUMNA 3: RESUMEN === */}
          <div className="col-md-4">
            <ResumenPedido
              mostrarBoton={(transportistaSeleccionado && fechaEntregaUsuario)}
              textoBoton="Continuar con pago"
              onContinuar={() => navigate("/pago")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OpcionesEntrega;
