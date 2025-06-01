import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set) => ({
      // Estado actual del panel lateral
      panelVisible: false,
      abrirPanel: () => set({ panelVisible: true }),
      cerrarPanel: () => set({ panelVisible: false }),
      togglePanel: () => set((state) => ({ panelVisible: !state.panelVisible })),

      // ✅ Estado persistido
      modoAdministracion: false,
      activarModoAdministracion: () => set({ modoAdministracion: true }),
      desactivarModoAdministracion: () => set({ modoAdministracion: false }),
    }),
    {
      name: 'admin-store', // nombre en localStorage
    }
  )
);
