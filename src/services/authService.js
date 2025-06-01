import { API_BASE_URL } from '@/utils/config';
const API_URL = `${API_BASE_URL}usuario`;
export const registrarUsuario = async (usuario) => {
  try {
    const res = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (!res.ok) {
      // 🔁 Adaptado: intenta leer el mensaje del backend como JSON
      const errorData = await res.json();
      throw new Error(errorData.mensaje || 'Error al registrar el usuario');
    }

    return res;
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
};

// ✅ Login de usuario
export const loginUsuario = async (email, clave) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, clave }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error en login:", error);
    return null;
  }
};

// ✅ Logout
export const logoutUsuario = () => {
  sessionStorage.clear(); // O cualquier limpieza que uses con AuthContext
};

// ✅ Sugerencias de dirección (Geoapify)
export const obtenerSugerenciasDireccion = async (direccion) => {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        direccion
      )}&format=json&lang=es&limit=5&apiKey=82ba75be80384acd956c1643c4cdae45`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.log("Error en Geoapify", error);
    return [];
  }
};

// ✅ Obtener usuario por ID (ya no usa localStorage)
export const obtenerUsuarioPorId = async (usuarioId) => {
  try {
    const res = await fetch(`${API_URL}/${usuarioId}`);
    if (!res.ok) throw new Error("No se pudo cargar el usuario");
    return await res.json();
  } catch (error) {
    console.error("Error al cargar el usuario:", error);
    return null;
  }
};

// ✅ Actualizar usuario (requiere usuarioId como parámetro)
export const actualizarUsuario = async (usuarioId, usuarioData) => {


  if (!usuarioId) return;

  try {
    const res = await fetch(`${API_URL}/guardarPaso`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "usuario-id": usuarioId.toString(),
      },
      body: JSON.stringify(usuarioData),
    });

    if (!res.ok) throw new Error("No se pudo actualizar el usuario");
    return await res.text();
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    return null;
  }
};

export const cambiarClave = async (cambioClaveDTO) => {
  try {
    const res = await fetch(`${API_URL}/cambiar-clave`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cambioClaveDTO),
    });

    const texto = await res.text();

    if (!res.ok) throw new Error(texto);

    return texto;
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    throw error;
  }
};