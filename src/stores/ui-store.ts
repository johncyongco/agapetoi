import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  settings: UserSettings;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      settings: {
        name: "",
        theme: "light",
      },
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
    }),
    {
      name: "agapetoi-ui",
    }
  )
);
