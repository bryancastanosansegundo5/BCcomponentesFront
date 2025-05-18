import { API_BASE_URL } from '@/utils/config';
const API_URL = `${API_BASE_URL}productos/`;
export const obtenerProductosTodos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }

  return [];
};

export const obtenerProductos = async (pagina = 0, size = 12) => {
  try {
    const res = await fetch(`${API_URL}paginado?page=${pagina}&size=${size}`);
    if (!res.ok) throw new Error("Error al cargar productos");
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    return { content: [] };
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}${id}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error(`Error al obtener el producto con ID ${id}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerRecomendaciones = (productos, usuarioId) => {
  const query = usuarioId ? `?usuarioId=${usuarioId}` : "";
  return fetch(`${API_URL}recomendaciones${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productos),
  }).then((res) => {
    if (!res.ok) throw new Error("Error al obtener recomendaciones");
    return res.json();
  });
};

export const obtenerMasVendidos = async () => {
  try {
    const res = await fetch(`${API_URL}mas-vendidos`);
    if (!res.ok) throw new Error("Error al cargar los más vendidos");
    return await res.json();
  } catch (error) {
    console.error("Error al obtener los productos más vendidos:", error);
    return [];
  }
};
export const obtenerMenosVendidos = async () => {
  try {
    const res = await fetch(`${API_URL}menos-vendidos`);
    if (!res.ok) throw new Error("Error al cargar los menos vendidos");
    return await res.json();
  } catch (error) {
    console.error("Error al obtener los productos menos vendidos:", error);
    return [];
  }
};

export const obtenerPorIds = async (ids) => {
  try {
    if (!ids || ids.length === 0) return [];

    const response = await fetch(`${API_URL}por-ids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      throw new Error("Error obteniendo productos por IDs");
    }

    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error("❌ Error en obtenerPorIds:", error);
    throw error;
  }
};

export const obtenerProductosPorCategoria = async (
  id,
  pagina = 0,
  size = 12
) => {
  try {
    const res = await fetch(
      `${API_URL}categoria/${id}?page=${pagina}&size=${size}`,
      {
        method: "GET",
      }
    );

    if (!res.ok)
      throw new Error(`Error al obtener los productos de la categoria: ${id}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerMasVendidosPorCategoria = async (idCategoria) => {
  try {
    const response = await fetch(
      `${API_URL}mas-vendidos/categoria/${idCategoria}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener productos más vendidos por categoría");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerMasVendidosPorCategoria:", error);
    return [];
  }
};

export const buscarCatalogo = async ({
  nombre,
  categoriaId,
  page = 0,
  size = 12,
}) => {
  const params = new URLSearchParams();

  if (nombre) params.append("nombre", nombre);
  if (categoriaId !== null && categoriaId !== undefined) {
    params.append("categoriaId", categoriaId);
  }

  params.append("page", page);
  params.append("size", size);

  const res = await fetch(`${API_URL}buscarCatalogo?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Error al buscar productos en el catálogo");
  }

  return await res.json();
};
