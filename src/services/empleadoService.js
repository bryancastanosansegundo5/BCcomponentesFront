import { API_BASE_URL } from '@/utils/config';
const API_URI = `${API_BASE_URL}empleado/`;
// ✅ Obtener todos los usuarios con pedidos
export const obtenerUsuarios = async (token) => {
  const res = await fetch(`${API_URI}gestion-usuarios`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener clientes");
  return await res.json();
};

// ✅ Buscar clientes por campo + valor (con pedidos)
export const buscarUsuarios = async (token, campo, valor, rolId) => {
  const url = `${API_URI}gestion-usuarios/buscar?campo=${campo}&valor=${encodeURIComponent(valor)}&rol=${rolId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al buscar clientes");
  return await res.json();
};

// ✅ Actualizar usuario desde panel de empleado/admin
export const actualizarUsuarioDesdeEmpleado = async (token, usuarioId, datosUsuario) => {
  const res = await fetch(`${API_URI}usuario/${usuarioId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datosUsuario)
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const mensaje = errorBody.message || "Error al actualizar usuario";
    throw new Error(mensaje);
  }

  return await res.text();
};

export const crearUsuarioDesdeEmpleado = async (token, usuario) => {
  const res = await fetch(`${API_URI}usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...usuario,
      rolId: parseInt(usuario.rolId || 1)
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al crear usuario");
  }

  return await res.text();
};

// ✅ Crear producto
export const crearProducto = async (token, producto) => {
  const res = await fetch(`${API_URI}productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(producto)
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error al crear producto");
  }
  return await res.text();
};

// ✅ Actualizar producto
export const actualizarProducto = async (token, id, producto) => {
  const res = await fetch(`${API_URI}productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(producto)
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error al actualizar producto");
  }
  return await res.text();
};

// ✅ Buscar productos por campo + valor (gestión interna)
export const buscarProductosGestion = async (token, campo, valor) => {
  const url = `${API_URI}productos/buscarGestion?campo=${campo}&valor=${encodeURIComponent(valor)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorBody = await res.json();
    const mensaje = errorBody.message || "Error al buscar productos";
    throw new Error(mensaje);
  }
  return await res.json();
};

export const importarProductosExcel = async (token, formData) => {
  const res = await fetch(`${API_URI}productos/importar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) throw res;
};

export const descargarPlantillaExcel = async (token) => {
  const response = await fetch(`${API_URI}productos/plantilla`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al descargar la plantilla");
  }

  return response.blob();
};

export const obtenerPedidosParaAdmin = async (token) => {
  const res = await fetch(`${API_URI}pedidos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Error al obtener los pedidos");
  return await res.json();
};
