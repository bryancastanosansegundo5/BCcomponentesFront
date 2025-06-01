import Cookies from 'js-cookie';

export function guardarProductoEnHistorial(productoId, usuarioId) {
  if (!productoId || !usuarioId) return;

  const nombreCookie = `historial_${usuarioId}`;
  const actual = Cookies.get(nombreCookie) || '[]';
  let historial = JSON.parse(actual);

  historial = historial.filter((id) => id !== productoId);
  historial.unshift(productoId);

  if (historial.length > 10) historial = historial.slice(0, 10);

  Cookies.set(nombreCookie, JSON.stringify(historial), { expires: 7 });//7 dias
}

export function obtenerHistorialUsuario(usuarioId) {
  if (!usuarioId) return [];

  const nombreCookie = `historial_${usuarioId}`;
  const cookie = Cookies.get(nombreCookie);
  return cookie ? JSON.parse(cookie) : [];
}
