const API_URI = "https://bccomponentesback.onrender.com/api/empleado/";
const API_URI_ADMIN = "https://bccomponentesback.onrender.com/api/admin/";

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
export const actualizarConfiguracion = async (token, clave, valor) => {
  const res = await fetch(`${API_URI_ADMIN}configuracion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ clave, valor }),
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
