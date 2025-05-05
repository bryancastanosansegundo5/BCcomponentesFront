// src/services/menuService.js

const API_URL = "https://bccomponentesback.onrender.com/api/opciones-menu/";

// ✅ Obtener opciones públicas (para usuarios no logueados o cliente)
export async function obtenerOpcionesPublicas() {
  try {
    const res = await fetch(`${API_URL}publicas`);
    if (!res.ok) throw new Error("No se pudieron cargar las opciones públicas");
    return await res.json();
  } catch (error) {
    console.error("❌ Error en obtenerOpcionesPublicas:", error);
    return [];
  }
}

// ✅ Obtener opciones por rol y ubicación (HEADER o LATERAL)
export async function obtenerOpcionesPorRolYUbicacion(rol, ubicacion) {
  try {
    const res = await fetch(`${API_URL}por-rol-y-ubicacion?rol=${rol}&ubicacion=${ubicacion}`);
    if (!res.ok) throw new Error("No se pudieron cargar las opciones del menú");

    return await res.json();
  } catch (error) {
    console.error("❌ Error en obtenerOpcionesPorRolYUbicacion:", error);
    return [];
  }
}

export async function obtenerOpcionesGestion(usuarioId) {
  try {
    const res = await fetch(`${API_URL}gestion`, {
      headers: { "usuario-id": usuarioId }
    });
    if (!res.ok) throw new Error("No se pudieron cargar las opciones de gestión");
    return await res.json();
  } catch (error) {
    console.error("❌ Error en obtenerOpcionesGestion:", error);
    return [];
  }
}