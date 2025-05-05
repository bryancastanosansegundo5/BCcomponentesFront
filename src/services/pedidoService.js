import { obtenerProductoPorId } from "./productoService";

const API_URL = "https://bccomponentesback.onrender.com/api/pedido/";

// ✅ Enviar pedido (usa userId externo)
export async function enviarPedido(pedidoDTO, userId) {
  if (!userId) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_URL}pedidoRealizado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "usuario-id": userId.toString(),
    },
    body: JSON.stringify(pedidoDTO),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Error al registrar el pedido: " + error);
  }

  return await response.json(); // Devuelve { numFactura: "..." }
}

// ✅ Obtener transportistas
export async function obtenerTransportistas() {
  const res = await fetch(`${API_URL}transportistas`);
  if (!res.ok) throw new Error("Error al obtener transportistas");
  return await res.json();
}

// ✅ Obtener métodos de pago
export async function obtenerMetodosPago() {
  const res = await fetch(`${API_URL}metodos-pago`);
  if (!res.ok) throw new Error("Error al obtener métodos de pago");
  return await res.json();
}

export const obtenerResumenPedidoCompleto = async (numFactura) => {
  try {
    // 1. Obtener resumen mínimo del pedido
    const res = await fetch(`${API_URL}resumen/${numFactura}`);
    if (!res.ok) throw new Error("No se pudo cargar el resumen del pedido");

    const datos = await res.json(); // { numFactura, productos: [{ id, cantidad }] }

    // 2. Para cada producto, obtener sus datos completos
    const productos = await Promise.all(
      datos.productos.map(async ({ id, cantidad }) => {
        const producto = await obtenerProductoPorId(id);
        return {
          ...producto,
          cantidad,
          subtotal: (producto.precio || 0) * cantidad,
        };
      })
    );

    // return {
    //   numFactura: datos.numFactura,
    //   productos
    // };
    return {
      datos,
      productos,
    };
  } catch (error) {
    console.error("❌ Error al cargar el resumen del pedido:", error);
    return null;
  }
};

export const obtenerPedidosPorUsuario = async (usuarioId) => {
  const res = await fetch(`${API_URL}usuario/${usuarioId}`);
  if (!res.ok) throw new Error("No se pudo cargar el historial");
  return await res.json();
};

export const obtenerFactura = async (usuarioId, numFactura) => {
  try {
    const res = await fetch(`${API_URL}factura/${numFactura}`, {
      headers: {
        "usuario-id": usuarioId,
      },
    });

    if (!res.ok) throw new Error("Error al descargar la factura");
    return await res.blob();
  } catch (err) {
    console.error("❌ Error al descargar la factura:", err);
    throw err;
  }
};
