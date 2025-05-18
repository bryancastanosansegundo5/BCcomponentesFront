import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario, loginUsuario } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useCarritoStore } from "../store/carritoStore";
import {
  volcarCarrito,
  obtenerCarritoUsuario
} from "../services/carritoService";

const Registro = () => {
  const [correoUsuario, setCorreoUsuario] = useState('')
  const [claveUsuario, setClaveUsuario] = useState('')
  const [confirmarClave, setConfirmarClave] = useState('')
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [apellidosUsuario, setApellidosUsuario] = useState('')

  const [mensajeExito, setMensajeExito] = useState('')
  const [mensajeError, setMensajeError] = useState('')

  const redirigir = useNavigate()
  const { login } = useAuth()
  const carritoLocal = useCarritoStore((state) => state.carrito);
  const setCarritoDesdeBackend = useCarritoStore((state) => state.setCarritoDesdeBackend);
  const manejarEnvioFormulario = async (e) => {
    e.preventDefault()
    setMensajeExito('')
    setMensajeError('')

    if (!correoUsuario.trim()) return setMensajeError("El email es obligatorio")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoUsuario))
      return setMensajeError("El email debe tener un formato válido")
    if (!claveUsuario.trim()) return setMensajeError("La contraseña es obligatoria")
    if (claveUsuario.length < 8) return setMensajeError("La contraseña debe tener al menos 8 caracteres")
    if (claveUsuario !== confirmarClave) return setMensajeError("Las contraseñas no coinciden")

    const nuevoUsuario = {
      email: correoUsuario,
      clave: claveUsuario,
      confirmarClave,
      nombre: nombreUsuario,
      apellidos: apellidosUsuario
    }

    try {
      const respuesta = await registrarUsuario(nuevoUsuario)

      if (!respuesta?.ok) {
        const texto = await respuesta.text()
        return setMensajeError(texto || 'Error al registrar el usuario')
      }

      const usuarioLogueado = await loginUsuario(correoUsuario, claveUsuario)
      if (usuarioLogueado) {
        login(usuarioLogueado)
        await volcarCarrito(carritoLocal, usuarioLogueado.id);
        const carritoFinal = await obtenerCarritoUsuario(usuarioLogueado.id);
                setCarritoDesdeBackend(carritoFinal);
        setMensajeExito('Registro y login exitosos. Redirigiendo...')
        setTimeout(() => redirigir('/'), 1500)
      } else {
        setMensajeError('El usuario se registró, pero no se pudo iniciar sesión automáticamente')
      }

    } catch (error) {
      console.error("❌ Error en el registro:", error)
      setMensajeError("Error inesperado en el registro")
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>

        <form onSubmit={manejarEnvioFormulario}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico*</label>
            <input
              type="text"
              placeholder='Ejemplo@tienda.com'
              className="form-control"
              value={correoUsuario}
              onChange={(e) => setCorreoUsuario(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña*</label>
            <input
              type="password"
              className="form-control"
              value={claveUsuario}
              placeholder='Minimo 8 caracteres'
              onChange={(e) => setClaveUsuario(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Repetir contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={apellidosUsuario}
              onChange={(e) => setApellidosUsuario(e.target.value)}
            />
          </div>

          {mensajeExito && (
            <div className="alert alert-success text-center">{mensajeExito}</div>
          )}
          {mensajeError && (
            <div className="alert alert-danger text-center">{mensajeError}</div>
          )}

          <button
            type="submit"
            className="btn w-100 fw-bold text-white"
            style={{ backgroundColor: '#ff5c00' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#C74900')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff5c00')}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}

export default Registro
