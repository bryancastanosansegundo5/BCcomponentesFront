import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ModalVaciarCesta = ({ visible, onConfirmar, onCancelar }) => {
  if (!visible) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <motion.div
          className="modal-content bg-white p-4 rounded shadow"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          style={{ width: '400px', textAlign: 'center' }}
        >
          <h5 className="fw-bold mb-3">Vaciar cesta</h5>
          <p className="text-muted mb-4">
            ¿Seguro que deseas vaciar la cesta? Esta acción no se puede deshacer.
          </p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-light" onClick={onCancelar}>Cerrar</button>
            <button
              className="btn btn-warning text-white fw-bold"
              style={{ backgroundColor: '#ff5c00', borderColor: '#ff5c00' }}
              onClick={onConfirmar}
            >
              Vaciar cesta
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export default ModalVaciarCesta
