// Servicio de carrito vinculado al backend (API REST)
const API_URL = "https://bccomponentesback.onrender.com/api/carrito/";

import { useCarritoStore } from "../store/carritoStore";
import { obtenerProductoPorId } from "./productoService";

// 🔹 Obtener usuarioId desde localStorage
function getUsuarioId() {
  const userJSON = localStorage.getItem("user");
  if (!userJSON) return null;

  try {
    const user = JSON.parse(userJSON);
    return user?.id || null;
  } catch {
    return null;
  }
}

// ✅ Añadir producto al carrito
export async function agregarAlCarrito(productoId) {
  const usuarioId = getUsuarioId();
  if (!usuarioId) {
    console.warn("🟡 Usuario no logueado. Producto añadido solo en local.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}agregar/${productoId}`, {
      method: "GET",
      headers: {
        "usuario-id": usuarioId.toString(),
      },
    });

    if (!response.ok) {
      throw new Error("Error al agregar al carrito");
    }
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    throw error;
  }
}

// ✅ Quitar una unidad del producto
export async function quitarDelCarrito(productoId) {
  const usuarioId = getUsuarioId();
  if (!usuarioId) return;

  try {
    const response = await fetch(`${API_URL}quitar/${productoId}`, {
      method: "GET",
      headers: {
        "usuario-id": usuarioId.toString(),
      },
    });

    if (!response.ok) {
      throw new Error("Error al quitar del carrito");
    }
  } catch (error) {
    console.error("❌ Error al quitar producto:", error);
    throw error;
  }
}

// ✅ Obtener carrito completo del usuario
export async function obtenerCarritoUsuario() {
  const usuarioId = getUsuarioId();
  if (!usuarioId) return null;

  try {
    const res = await fetch(`${API_URL}usuario`, {
      method: "GET",
      headers: {
        "usuario-id": usuarioId.toString(),
      },
    });

    if (!res.ok) throw new Error("Error al obtener el carrito");
    return await res.json();
  } catch (error) {
    console.error("❌ Error al cargar carrito de BBDD:", error);
    throw error;
  }
}

// ✅ Volcar carrito local (Zustand) a la BBDD
export async function volcarCarrito(carritoLocal) {
  const usuarioId = getUsuarioId();
  if (!usuarioId) return;

  try {
    const res = await fetch(`${API_URL}volcar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "usuario-id": usuarioId.toString(),
      },
      body: JSON.stringify(carritoLocal),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Error al volcar carrito:", error);
    }
  } catch (error) {
    console.error("❌ Error de red al volcar carrito:", error);
  }
}

// ✅ Vaciar el carrito del backend
export async function vaciarCarritoBBDD() {
  const usuarioId = getUsuarioId();
  if (!usuarioId) return;

  try {
    const res = await fetch(`${API_URL}vaciar`, {
      method: "DELETE",
      headers: {
        "usuario-id": usuarioId.toString(),
      },
    });

    if (!res.ok) {
      console.error("❌ Error al vaciar el carrito del backend");
    }
  } catch (error) {
    console.error("❌ Error de red al vaciar carrito:", error);
  }
}

// ✅ Eliminar producto completamente del backend
export async function eliminarProducto(idProducto) {
  const usuarioId = getUsuarioId();
  if (!usuarioId) return;

  try {
    await fetch(`${API_URL}eliminar/${idProducto}`, {
      method: "DELETE",
      headers: {
        "usuario-id": usuarioId.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Error al eliminar producto del backend:", error);
  }
}

// ✅ Cargar productos y carrito desde backend o local (Zustand)
export async function cargarCarritoYProductos() {
  const usuarioId = getUsuarioId();
  const store = useCarritoStore.getState();

  try {
    const carritoBD = await obtenerCarritoUsuario();

    if (carritoBD && Object.keys(carritoBD).length > 0) {
      const productos = {};
      for (const id of Object.keys(carritoBD)) {
        const producto = await obtenerProductoPorId(id);
        productos[String(id)] = producto;
      }

      store.setCarritoDesdeBackend(carritoBD);
      store.setProductos(Object.values(productos));
      return;
    }
  } catch (error) {
    console.warn("No hay sesión activa. Usando carrito local.");
  }

  // Fallback local
  const carritoLocal = store.carrito;
  if (!carritoLocal || Object.keys(carritoLocal).length === 0) return;

  const productos = {};
  for (const id of Object.keys(carritoLocal)) {
    const producto = await obtenerProductoPorId(id);
    productos[String(id)] = producto;
  }

  store.setProductos(Object.values(productos));
}

export async function manejarCompatibilidad(carrito) {
  try {
    const productos = Object.keys(carrito).map((id) => parseInt(id));
    console.log(productos);

    const response = await fetch(`${API_URL}comprobar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productos }),
    });

    if (!response.ok) {
      throw new Error("Error comprobando compatibilidad");
    }

    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error("❌ Error en la comprobación de compatibilidad:", error);
    throw error;
  }
}

export async function enviarPreguntaChat(mensaje, productosRecomendados) {
  try {
    const response = await fetch(`${API_URL}chat-compatibilidad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mensaje: mensaje,
        productosRecomendados: productosRecomendados, // array de IDs actuales recomendados
      }),
    });

    if (!response.ok) {
      throw new Error("Error enviando la pregunta al chat de compatibilidad");
    }

    const data = await response.json(); 

    return data;
  } catch (error) {
    console.error("❌ Error en el chat de compatibilidad:", error);
    throw error;
  }
}
