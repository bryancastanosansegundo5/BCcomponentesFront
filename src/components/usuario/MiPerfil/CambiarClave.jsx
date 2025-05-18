import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { cambiarClave } from "../../../services/authService";

const CambiarClave = () => {
  const { user: usuario } = useAuth();

  const [formulario, setFormulario] = useState({
    claveActual: "",
    nuevaClave: "",
    repetirNuevaClave: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!formulario.claveActual || formulario.claveActual.length < 8) {
      return setMensaje("❌ La contraseña actual debe tener al menos 8 caracteres.");
    }
  
    if (!formulario.nuevaClave || formulario.nuevaClave.length < 8) {
      return setMensaje("❌ La nueva contraseña debe tener al menos 8 caracteres.");
    }
  
    if (formulario.nuevaClave !== formulario.repetirNuevaClave) {
      return setMensaje("❌ Las nuevas contraseñas no coinciden.");
    }
    try {
      await cambiarClave({
        idUsuario: usuario.id,
        ...formulario,
      });

      setMensaje("✅ Contraseña actualizada correctamente.");
      setFormulario({
        claveActual: "",
        nuevaClave: "",
        repetirNuevaClave: "",
      });
    } catch (error) {
      setMensaje(`❌ ${error.message}`);
    }
  };

  return (
    <div>
      <h5 className="mb-4 fw-bold">Contraseña</h5>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="password"
              name="claveActual"
              className="form-control"
              placeholder="Contraseña actual"
              value={formulario.claveActual}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="password"
              name="nuevaClave"
              className="form-control"
              placeholder="Nueva contraseña"
              value={formulario.nuevaClave}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="password"
              name="repetirNuevaClave"
              className="form-control"
              placeholder="Repetir contraseña"
              value={formulario.repetirNuevaClave}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn border-0 text-white"
            style={{ backgroundColor: "#ff5c00" }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#C74900")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#ff5c00")
            }
          >
            Guardar
          </button>
        </div>

        <small className="text-muted d-block mt-2">
          Seguridad: utiliza entre 6 y 64 caracteres.
        </small>

        {mensaje && (
          <p className="text-center mt-3 mb-0 fw-semibold">
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
};

export default CambiarClave;
