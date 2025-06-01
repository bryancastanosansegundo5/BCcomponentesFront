import { API_BASE_URL } from '@/utils/config';
const API_URL = `${API_BASE_URL}valoracion/`;
// Crear una nueva valoración
export const guardarValoracion = async (valoracion) => {
  const res = await fetch(`${API_URL}crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valoracion),
  });

  if (!res.ok) {
    let error = "Error desconocido";
    try {
      error = await res.text(); // intenta extraer mensaje plano
    } catch (_) {
      // ignoramos si falla
    }
    throw new Error(error);
  }

  return;
};


// Obtener valoraciones visibles de un producto
export const obtenerValoracionesPorProducto = async (idProducto) => {
  const res = await fetch(`${API_URL}producto/${idProducto}`);

  if (!res.ok) throw new Error("Error al cargar valoraciones");

  return await res.json();
};

// Obtener valoraciones de un usuario
export const obtenerValoracionesPorUsuario = async (usuarioId) => {
  const res = await fetch(`${API_URL}usuario`, {
    headers: {
      "Content-Type": "application/json",
      "usuario-id": usuarioId,
    },
  });
  if (!res.ok) throw new Error("Error al cargar tus valoraciones");
  return res.json();
};

