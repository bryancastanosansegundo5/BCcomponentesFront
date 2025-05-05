const API_URI = "https://bccomponentesback.onrender.com/api/rol/";

export const obtenerRoles = async () => {
  const res = await fetch(API_URI);
  if (!res.ok) throw new Error("Error al obtener roles");
  return await res.json();
};
