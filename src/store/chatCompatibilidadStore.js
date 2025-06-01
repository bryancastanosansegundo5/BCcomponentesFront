import { create } from "zustand";

export const useChatCompatibilidadStore = create((set) => ({
  chatVisible: false,
  historial: [],

  abrirChat: () => set({ chatVisible: true }),
  cerrarChat: () => set({ chatVisible: false }),

  agregarMensaje: (mensaje) =>
    set((state) => ({ historial: [...state.historial, mensaje] })),

  limpiarHistorial: () => set({ historial: [] }),
}));
