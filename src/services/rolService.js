import { API_BASE_URL } from '@/utils/config';
const API_URI = `${API_BASE_URL}rol/`;
export const obtenerRoles = async () => {
  const res = await fetch(API_URI);
  if (!res.ok) throw new Error("Error al obtener roles");
  return await res.json();
};
