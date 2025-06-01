import { API_BASE_URL } from '@/utils/config';
const API_URI = `${API_BASE_URL}proveedores`;
// ✅ Obtener todos los proveedores
export const obtenerProveedores = async () => {
  const res = await fetch(API_URI);
  if (!res.ok) {
    throw new Error("Error al obtener proveedores");
  }
  return await res.json();
};
