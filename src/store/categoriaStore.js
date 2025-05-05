import { create } from "zustand";

export const useCategoriaStore = create((set) => ({
  panelCategoriasVisible: false,
  abrirPanelCategorias: () => set({ panelCategoriasVisible: true }),
  cerrarPanelCategorias: () => set({ panelCategoriasVisible: false }),
}));
