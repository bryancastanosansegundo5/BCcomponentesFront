import React from 'react';
import EstrellasValoracion from './EstrellasValoracion';

export default function ComentarioValoracion({ puntuacion, comentario, usuario }) {
  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">{usuario}</span>
      </div>
      <p className="text-gray-700">{comentario}</p>
    </div>
  );
}
