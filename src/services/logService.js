const API_URL = "https://bccomponentesback.onrender.com/api/logs/";

export const obtenerLogsLogin = async (token) => {
  try {
    const res = await fetch(`${API_URL}login`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("No se pudo cargar el log");
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.log("❌ Error en obtenerLogsLogin:", error);
    return [];
  }
};
