// (Mantiene el estado del carrito + productos + panel lateral)
// ¿Cuándo crear un store?
// - Si el estado afecta a varios componentes
// - Si el dato debe mantenerse al navegar
// - Si se necesita acceder/modificar desde distintos sitios sin pasar props

// Característica              Zustand                   localStorage
// Reactivo (re-renderiza)     ✅ Sí                     ❌ No
// Persistente                 ❌ No (por defecto)       ✅ Sí
// Ideal para lógica           ✅ Sí                     ❌ No
// Acceso desde componentes    ✅ Con hooks              ❌ Manualmente

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  agregarAlCarrito,
  quitarDelCarrito,
  eliminarProducto as eliminarProductoDeBackend,
  vaciarCarritoBBDD
} from "../services/carritoService";

export const useCarritoStore = create(
  persist(
    (set, get) => ({
      carrito: {},

      agregarProducto: async (idProducto) => {
        const productoId = String(idProducto);
        const cantidadActual = get().carrito[productoId] || 0;
        const usuario = JSON.parse(localStorage.getItem("user"));
        const usuarioId = usuario?.id;

        set({
          carrito: {
            ...get().carrito,
            [productoId]: cantidadActual + 1,
          },
        });

        try {
          await agregarAlCarrito(idProducto);
        } catch {
          console.warn("No se pudo guardar en BBDD. Probablemente sin sesión.");
        }
      },

      quitarProducto: async (idProducto) => {
        const productoId = String(idProducto);
        const cantidadActual = get().carrito[productoId] || 0;
        const usuario = JSON.parse(localStorage.getItem("user"));
        const usuarioId = usuario?.id;

        if (cantidadActual <= 0) return;

        const carritoActualizado = {
          ...get().carrito,
          [productoId]: cantidadActual - 1,
        };
        if (carritoActualizado[productoId] === 0) delete carritoActualizado[productoId];
        set({ carrito: carritoActualizado });

        try {
          await quitarDelCarrito(idProducto, usuarioId);
        } catch {
          console.warn("No se pudo quitar en BBDD. Probablemente sin sesión.");
        }
      },

      vaciarCarrito: async () => {
        const usuario = JSON.parse(localStorage.getItem("user"));
        const usuarioId = usuario?.id;

        try {
          await vaciarCarritoBBDD(usuarioId);
        } catch {
          console.warn("No se pudo vaciar en BBDD.");
        }
        set({ carrito: {} });
      },

      eliminarProducto: async (idProducto) => {
        const productoId = String(idProducto);
        const usuario = JSON.parse(localStorage.getItem("user"));
        const usuarioId = usuario?.id;

        await eliminarProductoDeBackend(idProducto, usuarioId);

        const nuevoCarrito = { ...get().carrito };
        delete nuevoCarrito[productoId];
        set({ carrito: nuevoCarrito });
      },

      setCarritoDesdeBackend: (carritoDesdeBackend) => {
        const carritoNormalizado = {};
        Object.entries(carritoDesdeBackend).forEach(([id, cantidad]) => {
          carritoNormalizado[String(id)] = cantidad;
        });
        set({ carrito: carritoNormalizado });
      },

      productos: {},
      setProductos: (productosLista) => {
        const nuevos = {};
        productosLista.forEach((producto) => {
          if (producto && producto.id) {
            nuevos[String(producto.id)] = producto;
          }
        });
      
        set((state) => ({
          productos: {
            ...state.productos, // ← mantiene los que ya están
            ...nuevos,           // ← añade o actualiza solo los nuevos
          },
        }));
      },

      panelVisible: false,
      abrirPanel: () => set({ panelVisible: true }),
      cerrarPanel: () => set({ panelVisible: false }),

      resetCarritoStore: () => {
        set({ carrito: {}, productos: {}, panelVisible: false });
        localStorage.removeItem("carrito");
      },
    }),
    {
      name: "carrito",
      getStorage: () => localStorage,
    }
  )
);