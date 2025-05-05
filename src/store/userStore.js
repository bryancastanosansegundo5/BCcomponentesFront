import { create } from 'zustand'

export const useUserStore = create((set) => ({
  visible: false,
  abrir: () => set({ visible: true }),
  cerrar: () => set({ visible: false }),
  toggle: () => set((state) => ({ visible: !state.visible }))
}))
