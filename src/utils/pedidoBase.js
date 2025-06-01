// src/utils/pedidoBase.js

export const direccionBase = {
  nombre: '',
  apellidos: '',
  pais: '',
  telefono: '',
  direccion: '',
  adicionales: '',
  codigoPostal: '',
  poblacion: '',
  provincia: '',
  guardarComoPredeterminada: false
}

export const pedidoBase = {
  direccion: { ...direccionBase },
  productos: [],            // aunque lo gestiones en carritoStore, mantenemos por coherencia
  metodoPago: null,
  transportista: null,
  fechaEntregaUsuario: '',         
  datosTarjeta: null ,
  total: 0       
}
