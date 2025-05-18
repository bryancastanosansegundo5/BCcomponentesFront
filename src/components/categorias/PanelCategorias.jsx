import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCategoriaStore } from '../../store/categoriaStore'
import { useBusquedaStore } from '../../store/busquedaStore'
import { obtenerCategorias } from '../../services/categoriaService'
import { useNavigate } from 'react-router-dom'
import '../../styles/panelPerfil.css' // mismo estilo visual

const PanelCategorias = () => {
  const visible = useCategoriaStore((state) => state.panelCategoriasVisible)
  const cerrar = useCategoriaStore((state) => state.cerrarPanelCategorias)
  const setCategoriaIdBusqueda = useBusquedaStore((state) => state.setCategoriaIdBusqueda)
  const setTexto = useBusquedaStore((state) => state.setTexto)
  const [categorias, setCategorias] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (visible) {
      obtenerCategorias().then(setCategorias).catch(console.error)
    }
  }, [visible])

  const manejarClickCategoria = (id) => {
    setCategoriaIdBusqueda(id)
    setTexto("")
    cerrar()
    navigate("/catalogo")
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
            className="position-fixed top-0 start-0 bg-white shadow-lg p-3"
            style={{ width: '300px', height: '100vh', zIndex: 1041 }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Categorías</h5>
              <button className="btn btn-link text-decoration-none boton-cerrar-x" onClick={cerrar}>✕</button>
            </div>

            <ul className="list-unstyled">
              {categorias.map((cat) => (
                <li key={cat.id} className="mb-2">
                  <button
                    onClick={() => manejarClickCategoria(cat.id)}
                    className="btn btn-link text-decoration-none fw-medium link-animado d-inline-block"
                  >
                    {cat.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PanelCategorias
