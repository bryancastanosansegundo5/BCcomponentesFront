// src/store/pedidoStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pedidoBase } from '../utils/pedidoBase'

export const usePedidoStore = create(
  persist(
    (set) => ({
      // Estado inicial del pedido
      pedido: {
        ...pedidoBase,
        fechaEntregaUsuario: '',
        datosTarjeta: null,
        numFactura: '' // ← nuevo campo
      },

      actualizarPedido: (nuevosDatos) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            ...nuevosDatos
          }
        })),

      setDireccion: (direccion) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            direccion
          }
        })),

      setTransportista: (transportista) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            transportista
          }
        })),

      setMetodoPago: (metodoPago) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            metodoPago
          }
        })),

      setFechaEntregaUsuario: (fechaEntregaUsuario) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            fechaEntregaUsuario
          }
        })),

      setDatosTarjeta: (datosTarjeta) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            datosTarjeta
          }
        })),

      setNumFactura: (numFactura) =>
        set((state) => ({
          pedido: {
            ...state.pedido,
            numFactura
          }
        })),

      resetPedido: () => {
        set({
          pedido: {
            ...pedidoBase,
            fechaEntregaUsuario: '',
            datosTarjeta: null,
            numFactura: ''
          }
        })
        localStorage.removeItem('pedido')
      }
    }),
    {
      name: 'pedido',
      getStorage: () => localStorage
    }
  )
)
