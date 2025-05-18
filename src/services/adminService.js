import { API_BASE_URL } from '@/utils/config';
const API_URI = `${API_BASE_URL}empleado/`;
const API_URI_ADMIN = `${API_BASE_URL}admin/`;


// Obtener empleados (rolId = 2)
export const obtenerEmpleados = async (token) => {
  const res = await fetch(`${API_URI}gestion-usuarios/buscar?campo=rol&valor=2`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al obtener empleados");
  return await res.json();
};

// Obtener administradores (rolId = 3)
export const obtenerAdministradores = async (token) => {
  const res = await fetch(`${API_URI}gestion-usuarios/buscar?campo=rol&valor=3`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al obtener administradores");
  return await res.json();
};

// Obtener configuración
export const obtenerConfiguracion = async (token) => {
  const res = await fetch(`${API_URI_ADMIN}configuracion`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al cargar configuración");
  return await res.json();
};

// Actualizar configuración
export const actualizarConfiguracion = async (token, id, clave, valor) => {
  const res = await fetch(`${API_URI_ADMIN}configuracion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ id, clave, valor }),
  });

  if (res.status === 409) throw new Error("clave_repetida");
  if (!res.ok) throw new Error("Error al actualizar configuración");

  return await res.json();
};

// Eliminar configuración
export const eliminarConfiguracion = async (token, clave) => {
  const res = await fetch(`${API_URI_ADMIN}configuracion/${clave}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al eliminar configuración");
};

// Obtener ventas agrupadas por mes
export const obtenerVentasMensuales = async (token) => {
  const res = await fetch(`${API_URI_ADMIN}estadisticas/ventas-mensuales`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al obtener ventas mensuales");
  return await res.json();
};

// Obtener resumen de estadísticas
export const obtenerResumenEstadisticas = async (token) => {
  const res = await fetch(`${API_URI_ADMIN}estadisticas/resumen`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al obtener resumen de estadísticas");
  return await res.json();
};

// export const obtenerValoracionesAdmin = async (token) => {
//   const res = await fetch(`${API_URI_ADMIN}valoraciones`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Error al cargar valoraciones");
//   return await res.json();
// };

export const cambiarVisibilidadValoracion = async (token, id, visible) => {
  const res = await fetch(`${API_URI_ADMIN}valoraciones/${id}/visibilidad`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ visible }),
  });

  if (!res.ok) throw new Error("No se pudo cambiar la visibilidad");
};

export const obtenerValoracionesAdmin = async (token, page = 0, size = 20) => {
  const res = await fetch(`${API_URI_ADMIN}valoraciones?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al obtener valoraciones");
  return await res.json(); // Devuelve Page<ValoracionAdminDTO>
};

export const buscarValoracionesFiltradas = async (token, filtros = {}, page = 0, size = 20) => {
  const params = new URLSearchParams({
    ...filtros,
    page,
    size
  });

  const res = await fetch(`${API_URI_ADMIN}valoraciones/buscar?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Error al buscar valoraciones");
  return await res.json(); // Devuelve Page<ValoracionAdminDTO>
};


