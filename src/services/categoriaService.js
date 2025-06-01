import { API_BASE_URL } from '@/utils/config';
const API_URL = `${API_BASE_URL}categorias/`;
export const obtenerCategorias = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener categorías");
    return await res.json();
  };

  export const obtenerCategoriasResumen = async () => {
    const res = await fetch(`${API_URL}resumen`);
    if (!res.ok) throw new Error("Error al obtener categorías");
    return await res.json();
  };
  