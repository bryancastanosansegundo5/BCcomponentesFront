import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdminStore } from '../../store/adminStore'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import '../../styles/panelPerfil.css'
import { obtenerOpcionesGestion } from '../../services/menuService'

const PanelAdministracion = () => {
  const visible = useAdminStore((state) => state.panelVisible)
  const cerrar = useAdminStore((state) => state.cerrarPanel)
  const { user } = useAuth()
  const [opciones, setOpciones] = useState([])

  useEffect(() => {
    if (!visible || !user?.id) return
  
    obtenerOpcionesGestion(user.id)
      .then(setOpciones)
      .catch(console.error)
  }, [visible, user])

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
              <h5 className="fw-bold">Administración</h5>
              <button className="btn btn-link boton-cerrar-x" onClick={cerrar}>✕</button>
            </div>

            <ul className="list-unstyled">
            {opciones
  .filter(opcion => opcion.ruta.startsWith('/admin'))
  .map((opcion, i) => (
    <li key={i} className="mb-2">
      <Link
        to={opcion.ruta}
        className="link-animado fw-medium text-decoration-none d-inline-block"
        onClick={cerrar}
      >
        {opcion.nombre}
      </Link>
    </li>
))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PanelAdministracion
