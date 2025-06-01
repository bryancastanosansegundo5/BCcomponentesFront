import React, { useEffect, useState } from 'react';
import { obtenerValoracionesPorProducto } from '../services/valoracionesService';
import ComentarioValoracion from './ComentarioValoracion';

function ListaValoraciones({ idProducto }) {
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerValoracionesPorProducto(idProducto)
      .then(setValoraciones)
      .catch(err => setError(err.message));
  }, [idProducto]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (valoraciones.length === 0) return <p>No hay valoraciones aún.</p>;

  return (
    <div className="space-y-4">
      {valoraciones.map((v) => (
        <ComentarioValoracion
          key={v.id}
          usuario={v.usuario?.nombre || 'Anónimo'}
          puntuacion={v.puntuacion}
          comentario={v.comentario}
        />
      ))}
    </div>
  );
}

export default ListaValoraciones;
