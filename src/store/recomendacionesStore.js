import { create } from "zustand";

export const useRecomendacionesStore = create((set, get) => ({
  productosRecomendados: [],

  abrir: () => set({ visible: true }),
  cerrar: () => set({ visible: false }),
  visible: false,

  setProductosRecomendados: (productos) => set({ productosRecomendados: productos }),

  agregarProductos: (nuevosIds) => {
    const productosActuales = get().productosRecomendados;
    const idsActuales = productosActuales.map((producto) => producto.id);

    const nuevosProductos = nuevosIds
      .filter((id) => !idsActuales.includes(id))
      .map((id) => ( id ));

    const actualizados = [...productosActuales, ...nuevosProductos].slice(-6);
    set({ productosRecomendados: actualizados });
  },

  quitarProductos: (idsAEliminar) => {
    const productosActuales = get().productosRecomendados;
    const actualizados = productosActuales.filter(
      (producto) => !idsAEliminar.includes(producto.id)
    );
    set({ productosRecomendados: actualizados });
  },

  actualizarProductos: (productosActualizados) => {
    const productosExistentes = get().productosRecomendados;

    const nuevos = productosExistentes.map((producto) => {
      const productoActualizado = productosActualizados.find((p) => p.id === producto.id);
      return productoActualizado ? productoActualizado : producto;
    });

    set({ productosRecomendados: nuevos });
  }
}));