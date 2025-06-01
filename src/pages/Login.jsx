import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUsuario } from "../services/authService";
import {
  obtenerCarritoUsuario,
  volcarCarrito,
  vaciarCarritoBBDD,
} from "../services/carritoService";
import { useNavigate } from "react-router-dom";
import { useCarritoStore } from "../store/carritoStore";
import ModalFusionarCarrito from "../components/carrito/ModalFusionarCarrito";

const Login = () => {
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [claveUsuario, setClaveUsuario] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const carritoBDRef = useRef(null);
  const usuarioRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);
  const setCarritoDesdeBackend = useCarritoStore(
    (state) => state.setCarritoDesdeBackend
  );
  const carritoLocal = useCarritoStore((state) => state.carrito);
  console.log("🛒 Carrito actual en Zustand:", useCarritoStore.getState().carrito);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    if (!correoUsuario.trim())
      return setMensajeError("El email es obligatorio");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoUsuario))
      return setMensajeError("El email debe tener un formato válido");
    if (!claveUsuario.trim())
      return setMensajeError("La contraseña es obligatoria");
    if (claveUsuario.length < 8)
      return setMensajeError("La contraseña debe tener al menos 8 caracteres");

    const usuario = await loginUsuario(correoUsuario, claveUsuario);
    if (!usuario || usuario.errorMessage)
      return setMensajeError(
        usuario?.errorMessage || "Email o contraseña incorrectos"
      );

    login(usuario);
    usuarioRef.current = usuario;

    try {
      const carritoDesdeBD = await obtenerCarritoUsuario(usuario.id);
      const tieneCarritoBD =
        carritoDesdeBD && Object.keys(carritoDesdeBD).length > 0;
      const tieneCarritoLocal =
        carritoLocal && Object.keys(carritoLocal).length > 0;

      carritoBDRef.current = carritoDesdeBD;

      if (tieneCarritoBD && tieneCarritoLocal) {
        const sonIguales =
          JSON.stringify(carritoDesdeBD) === JSON.stringify(carritoLocal);
        if (sonIguales) {
          setCarritoDesdeBackend(carritoDesdeBD);
          navigate("/");
        } else {
          setMostrarModal(true);
        }
        return;
      }

      if (tieneCarritoBD) {
        setCarritoDesdeBackend(carritoDesdeBD);
      } else if (tieneCarritoLocal) {
        await volcarCarrito(carritoLocal, usuario.id);
        const carritoFinal = await obtenerCarritoUsuario(usuario.id);
        setCarritoDesdeBackend(carritoFinal);
      }

      navigate("/");
    } catch (error) {
      console.error("❌ Error al sincronizar el carrito:", error);
    }
  };
  
  
  const fusionarCarritos = async () => {
    const carritoBD = carritoBDRef.current || {};
    const usuario = usuarioRef.current;

    const carritoFusionado = { ...carritoBD };
    for (const id in carritoLocal) {
      carritoFusionado[id] = (carritoFusionado[id] || 0) + carritoLocal[id];
    }

    await vaciarCarritoBBDD(usuario.id);
    await volcarCarrito(carritoFusionado, usuario.id);
    const carritoFinal = await obtenerCarritoUsuario(usuario.id);

    setCarritoDesdeBackend(carritoFinal);
    setMostrarModal(false);
    navigate("/");
  };
  



  const mantenerCarritoBD = () => {
    const carritoBD = carritoBDRef.current || {};
    setCarritoDesdeBackend(carritoBD);
    setMostrarModal(false);
    navigate("/");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card p-4 shadow rounded-4 border-0"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={correoUsuario}
              onChange={(e) => setCorreoUsuario(e.target.value)}
              className="form-control"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="clave" className="form-label fw-medium">
              Contraseña
            </label>
            <input
              id="clave"
              type="password"
              value={claveUsuario}
              onChange={(e) => setClaveUsuario(e.target.value)}
              className="form-control"
              placeholder="********"
              required
            />
          </div>
          {mensajeError && (
            <div className="text-danger mb-3 fw-medium">{mensajeError}</div>
          )}
          <button
            type="submit"
            className="btn w-100 fw-bold text-white"
            style={{ backgroundColor: "#ff5c00" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
          >
            Entrar
          </button>
        </form>
      </div>

      <ModalFusionarCarrito
        visible={mostrarModal}
        onConfirmarMerge={fusionarCarritos}
        onMantenerBD={mantenerCarritoBD}
        onCancelar={() => setMostrarModal(false)}
      />
    </div>
  );
};

export default Login;
