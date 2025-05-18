import React from 'react';
import { MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";

function EstrellasValoracion({ media, total }) {
  const estrellasLlenas = Math.floor(media);
  const mediaDecimal = media - estrellasLlenas;
  const tieneMediaEstrella = mediaDecimal >= 0.25 && mediaDecimal < 0.75;
  const estrellasVacias = 5 - estrellasLlenas - (tieneMediaEstrella ? 1 : 0);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex text-[#ff5c00] text-lg">
        {Array.from({ length: estrellasLlenas }).map((_, i) => (
          <MdStar key={`llena-${i}`} />
        ))}
        {tieneMediaEstrella && <MdStarHalf />}
        {Array.from({ length: estrellasVacias }).map((_, i) => (
          <MdStarBorder key={`vacia-${i}`} />
        ))}
      </span>
      {total >= 0 && (
        <span className="text-gray-600">({total})</span>
      )}
    </div>

  );
}

export default EstrellasValoracion;
