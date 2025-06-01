import { API_BASE_URL } from '@/utils/config';
const PAYPAL_API = `${API_BASE_URL}paypal/`;
// 🔁 Crear pedido PayPal
export async function crearPedidoPaypal(total, moneda = "EUR") {
  const response = await fetch(`${PAYPAL_API}crear-pedido`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ total, moneda }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Error al crear pedido PayPal: " + error);
  }

  const data = await response.json();
  return data.orderID;
}

// ✅ Capturar pedido PayPal y generar pedido real
export async function capturarPedidoPaypal(orderID, pedidoDTO, userId) {
  const response = await fetch(`${PAYPAL_API}capturar-pedido?orderID=${orderID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "usuario-id": userId.toString(),
    },
    body: JSON.stringify(pedidoDTO),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Error al capturar pedido PayPal: " + error);
  }

  return await response.json(); // { numFactura: "..." }
}
