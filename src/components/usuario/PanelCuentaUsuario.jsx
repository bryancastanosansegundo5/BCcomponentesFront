import { AnimatePresence, motion } from 'framer-motion'
import { useUserStore } from '../../store/userStore'
import { useCarritoStore } from '../../store/carritoStore'
import { usePedidoStore } from '../../store/pedidoStore'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { obtenerOpcionesPorRolYUbicacion } from '../../services/menuService'
import '../../styles/panelPerfil.css'
import { useAdminStore } from "../../store/adminStore";

const PanelCuentaUsuario = () => {
  const visible = useUserStore((state) => state.visible)
  const cerrar = useUserStore((state) => state.cerrar)
  const resetCarritoStore = useCarritoStore((state) => state.resetCarritoStore)
  const resetPedidoStore = usePedidoStore((state) => state.resetPedido)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const desactivarModoAdministracion = useAdminStore(
    (state) => state.desactivarModoAdministracion
  );
  const [opcionesLateral, setOpcionesLateral] = useState([])

  useEffect(() => {
    const cargarOpciones = async () => {
      const rolNombre = user?.rolId === 3 ? 'ADMIN' : user?.rolId === 2 ? 'EMPLEADO' : 'CLIENTE'
      const resultado = (await obtenerOpcionesPorRolYUbicacion(rolNombre, 'LATERAL'))
        .filter(opcion => !opcion.ruta.startsWith('/admin') && !opcion.ruta.startsWith('/empleado'))

      setOpcionesLateral(resultado)
    }

    if (user) cargarOpciones()
  }, [user])

  const manejarLogout = () => {
    desactivarModoAdministracion();
    resetCarritoStore()
    resetPedidoStore()
    logout()
    cerrar()
    navigate('/')
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            style={{ zIndex: 1040 }}
          />
          <motion.div
            className="position-fixed top-0 end-0 bg-white shadow-lg p-3"
            style={{ width: '300px', height: '100vh', zIndex: 1041 }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Mi cuenta</h5>
              <button className="btn btn-link" style={{ color: 'black' }} onClick={cerrar}>✕</button>
            </div>

            <ul className="list-unstyled">
              {opcionesLateral.map(({ nombre, ruta }) => (
                <li className="mb-2" key={nombre}>
                  <Link
                    to={ruta}
                    className="text-decoration-none fw-medium d-inline-block link-animado"
                    style={{ color: 'black' }}
                    onMouseEnter={(e) => (e.target.style.color = '#ff5c00')}
                    onMouseLeave={(e) => (e.target.style.color = 'black')}
                    onClick={cerrar}
                  >
                    {nombre}
                  </Link>
                </li>
              ))}

              <li className="mt-4">
                <button
                  className="btn w-100 fw-bold text-white"
                  style={{ backgroundColor: '#ff5c00' }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#C74900')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff5c00')}
                  onClick={manejarLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PanelCuentaUsuario
