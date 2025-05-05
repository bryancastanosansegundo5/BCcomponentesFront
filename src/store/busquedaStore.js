import { create } from "zustand";

export const useBusquedaStore = create((set) => ({
  texto: "",               
  categoriaIdBusqueda: "",        

  setTexto: (texto) => set({ texto }),
  setCategoriaIdBusqueda: (categoriaIdBusqueda) => set({ categoriaIdBusqueda }),
  setBusquedaDesdeCategoria: (categoriaId) => set({ categoriaIdBusqueda: categoriaId, texto: "" }),

  resetBusqueda: () => set({ texto: "", categoriaIdBusqueda: "" }),
}));
