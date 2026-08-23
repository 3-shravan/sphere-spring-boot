import { create } from "zustand"

export const useDeveloperStore = create((set) => ({
  isChat: true,
  setIsChat: (value) => set({ isChat: value }),
}))
