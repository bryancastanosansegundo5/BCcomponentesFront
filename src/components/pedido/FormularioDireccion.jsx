import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraProgresoPedido from "./BarraProgresoPedido";
import { BiHome } from "react-icons/bi";
import { useCarritoStore } from "../../store/carritoStore";
import {
  obtenerSugerenciasDireccion,
  obtenerUsuarioPorId,
  actualizarUsuario,
} from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import { usePedidoStore } from "../../store/pedidoStore";
import { provincias } from "../../utils/configuracionUI";
import Flag from "react-world-flags";
import ResumenPedido from "./ResumenPedido";

const FormularioDireccion = () => {
  const [pasoActual, setPasoActual] = useState(2);
  const [sugerencias, setSugerencias] = useState([]);
  const navigate = useNavigate();
  const{user} =useAuth();
  

  const carrito = useCarritoStore((state) => state.carrito);
  const productos = useCarritoStore((state) => state.productos);

  const direccion = usePedidoStore((state) => state.pedido.direccion);
  const actualizarDireccion = usePedidoStore((state) => state.setDireccion);

  const subtotal = Object.entries(carrito).reduce((acum, [id, cantidad]) => {
    const producto = productos[id];
    return acum + (producto?.precio || 0) * cantidad;
  }, 0);

  const estaCompleto = Object.entries(direccion).every(([clave, valor]) => {
    if (clave === "guardarComoPredeterminada" || clave === "adicionales")
      return true;
    return valor.trim() !== "";
  });

  useEffect(() => {
    const cargarDireccionGuardada = async () => {
      const usuario = JSON.parse(localStorage.getItem("user"));
      
      if (!usuario || !usuario.id) return;

      const datosUsuario = await obtenerUsuarioPorId(usuario.id);
      if (datosUsuario) {
        actualizarDireccion({
          ...direccion,
          nombre: datosUsuario.nombre || "",
          apellidos: datosUsuario.apellidos || "",
          pais: datosUsuario.pais || "",
          telefono: datosUsuario.telefono || "",
          direccion: datosUsuario.direccion || "",
          adicionales: datosUsuario.adicionales || "",
          codigoPostal: datosUsuario.codigoPostal || "",
          poblacion: datosUsuario.poblacion || "",
          provincia: datosUsuario.provincia || "",
        });
      }
    };

    cargarDireccionGuardada();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "direccion") {
      actualizarDireccion({ ...direccion, [name]: value });

      if (value.length < 3) {
        setSugerencias([]);
        return;
      }

      const resultados = await obtenerSugerenciasDireccion(value);
      setSugerencias(resultados);
    } else {
      actualizarDireccion({ ...direccion, [name]: value });
    }
  };

  return (
    <>
      <BarraProgresoPedido
        pasoActivo={pasoActual}
        onPasoClick={(nuevoPaso) => {
          setPasoActual(nuevoPaso);
          if (nuevoPaso === 1) navigate("/cesta");
          if (nuevoPaso === 2) navigate("/formularioDireccion");
        }}
      />

      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="mb-4">
              <div className="d-flex align-items-center border-bottom pb-2 mb-4">
                <BiHome size={24} className="me-2" />
                <h4 className="mb-0 fw-bold">Dirección de entrega</h4>
              </div>

              <form>
                <div className="row mb-3">
                  <div className="col">
                    <input
                      name="nombre"
                      value={direccion.nombre}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nombre*"
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      name="apellidos"
                      value={direccion.apellidos}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Apellidos*"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <select
                      name="pais"
                      className="form-select"
                      value={direccion.pais}
                      onChange={handleChange}
                      required
                    >
                      <option disabled value="">
                        País*
                      </option>
                      <option value="España">España</option>
                      <option value="Andorra">Andorra</option>
                      <option value="Portugal">Portugal</option>
                    </select>
                  </div>
                  <div className="col d-flex">
                    <span
                      className="input-group-text"
                      style={{ backgroundColor: "#ccc" }}
                    >
                      <Flag code="ES" style={{ width: 20 }} /> +34
                    </span>
                    <input
                      name="telefono"
                      type="tel"
                      className="form-control border-start-0 rounded-start-0"
                      placeholder="Teléfono*"
                      required
                      value={direccion.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    name="direccion"
                    type="text"
                    className="form-control"
                    placeholder="Dirección y número*"
                    required
                    value={direccion.direccion}
                    onChange={handleChange}
                  />
                  {sugerencias.length > 0 && (
                    <ul
                      className="list-group position-absolute w-100 shadow"
                      style={{ zIndex: 1000 }}
                    >
                      {sugerencias.map((sug, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            actualizarDireccion({
                              ...direccion,
                              direccion: sug.formatted,
                            });
                            setSugerencias([]);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {sug.formatted}
                        </li>
                      ))}
                    </ul>
                  )}
                  <small className="text-muted">
                    Ej. Calle de Cavanilles, 35
                  </small>
                </div>

                <div className="mb-3">
                  <input
                    name="adicionales"
                    type="text"
                    className="form-control"
                    placeholder="Datos adicionales"
                    value={direccion.adicionales}
                    onChange={handleChange}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <input
                      name="codigoPostal"
                      type="text"
                      className="form-control"
                      placeholder="Código postal*"
                      required
                      value={direccion.codigoPostal}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <input
                      name="poblacion"
                      type="text"
                      className="form-control"
                      placeholder="Población*"
                      required
                      value={direccion.poblacion}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <select
                    name="provincia"
                    className="form-select"
                    required
                    value={direccion.provincia}
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Provincia*
                    </option>
                    {provincias.map((prov, i) => (
                      <option key={i} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="predeterminada"
                    checked={direccion.guardarComoPredeterminada}
                    onChange={(e) =>
                      actualizarDireccion({
                        ...direccion,
                        guardarComoPredeterminada: e.target.checked,
                      })
                    }
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="predeterminada"
                  >
                    Marcar como predeterminada (para futuras compras).
                  </label>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <ResumenPedido
              textoBoton="Guardar y continuar"
              onContinuar={async () => {
                if (direccion.guardarComoPredeterminada) {
                  const datosGuardar = {
                    nombre: direccion.nombre,
                    apellidos: direccion.apellidos,
                    pais: direccion.pais,
                    telefono: direccion.telefono,
                    direccion: direccion.direccion,
                    adicionales: direccion.adicionales,
                    codigoPostal: direccion.codigoPostal,
                    poblacion: direccion.poblacion,
                    provincia: direccion.provincia,
                  };

                  await actualizarUsuario(user.id,datosGuardar);
                }
                navigate("/opcionesEntrega");
              }}
              mostrarBoton={estaCompleto}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioDireccion;
