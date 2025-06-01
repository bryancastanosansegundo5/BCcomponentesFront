import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { useAuth } from "../../../context/AuthContext";
import {
  obtenerUsuarioPorId,
  actualizarUsuario,
  obtenerSugerenciasDireccion,
} from "../../../services/authService";
import Flag from "react-world-flags";
import { useNavigate } from "react-router-dom";
import CambiarClave from "./CambiarClave";
import { provincias } from "../../../utils/configuracionUI";



const PerfilUsuario = () => {
  const { user: usuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario?.id) {
      obtenerUsuarioPorId(usuario.id).then(setPerfil);
    }
  }, [usuario]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await actualizarUsuario(usuario.id, perfil);
      setMensaje("✅ Cambios guardados correctamente.");
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("❌ Error al guardar.");
    }
  };

  if (!perfil) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <div className="mb-4 d-flex align-items-center border-bottom pb-2">
        <BiUser size={24} className="me-2" />
        <h4 className="mb-0 fw-bold">Editar perfil</h4>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row mb-3">
          <div className="col">
            <input
              name="nombre"
              type="text"
              className="form-control"
              placeholder="Nombre*"
              value={perfil.nombre || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              name="apellidos"
              type="text"
              className="form-control"
              placeholder="Apellidos*"
              value={perfil.apellidos || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <select
              className="form-select"
              name="pais"
              value={perfil.pais || ""}
              onChange={handleChange}
              required
            >
              <option disabled value="">País*</option>
              <option value="España">España</option>
              <option value="Andorra">Andorra</option>
              <option value="Portugal">Portugal</option>
            </select>
          </div>
          <div className="col d-flex">
            <span className="input-group-text" style={{ backgroundColor: "#ccc" }}>
              <Flag code="ES" style={{ width: 20 }} /> +34
            </span>
            <input
              name="telefono"
              type="tel"
              className="form-control border-start-0 rounded-start-0"
              placeholder="Teléfono"
              value={perfil.telefono || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3 position-relative">
          <input
            name="direccion"
            type="text"
            className="form-control"
            placeholder="Dirección"
            value={perfil.direccion || ""}
            onChange={async (e) => {
              const valor = e.target.value;
              setPerfil({ ...perfil, direccion: valor });

              if (valor.length < 3) {
                setSugerencias([]);
                return;
              }

              const resultados = await obtenerSugerenciasDireccion(valor);
              setSugerencias(resultados);
            }}
          />
          {sugerencias.length > 0 && (
            <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
              {sugerencias.map((sug, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setPerfil({ ...perfil, direccion: sug.formatted });
                    setSugerencias([]);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {sug.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="row mb-3">
          <div className="col">
            <input
              name="codigoPostal"
              type="text"
              className="form-control"
              placeholder="Código postal"
              value={perfil.codigoPostal || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              name="poblacion"
              type="text"
              className="form-control"
              placeholder="Población"
              value={perfil.poblacion || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <select
            className="form-select"
            name="provincia"
            value={perfil.provincia || ""}
            onChange={handleChange}
            required
          >
            <option disabled value="">Provincia*</option>
            {provincias.map((prov, i) => (
              <option key={i} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            className="btn border-0 text-white"
            style={{ backgroundColor: "#ff5c00" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
            onClick={handleGuardar}
          >
            Guardar cambios
          </button>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </div>

        {mensaje && (
          <p className="text-center mt-3 mb-0 text-success fw-bold">
            {mensaje}
          </p>
        )}
      </form>

      <hr className="my-5" />
      <CambiarClave />
    </div>
  );
};

export default PerfilUsuario;
