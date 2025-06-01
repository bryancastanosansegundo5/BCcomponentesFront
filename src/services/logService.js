import { API_BASE_URL } from '@/utils/config';
const API_URL = `${API_BASE_URL}logs/`;

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

export const obtenerLogsErrores = async (token) => {
  try {
    const res = await fetch(`${API_URL}error`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("No se pudo cargar el log de errores");
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.log("❌ Error en obtenerLogsErrores:", error);
    return [];
  }
};
