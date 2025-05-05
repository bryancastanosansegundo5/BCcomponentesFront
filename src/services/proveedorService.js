const API_URI = "https://bccomponentesback.onrender.com/api/proveedores";

// ✅ Obtener todos los proveedores
export const obtenerProveedores = async () => {
  const res = await fetch(API_URI);
  if (!res.ok) {
    throw new Error("Error al obtener proveedores");
  }
  return await res.json();
};
