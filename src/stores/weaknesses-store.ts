import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Weakness, WeaknessStatus } from "@/types";

interface WeaknessesState {
  weaknesses: Weakness[];
  addWeakness: (weakness: Omit<Weakness, "id" | "created_at" | "updated_at">) => void;
  updateWeakness: (id: string, updates: Partial<Weakness>) => void;
  removeWeakness: (id: string) => void;
  archiveWeakness: (id: string) => void;
  setWeaknessStatus: (id: string, status: WeaknessStatus) => void;
  getActiveWeaknesses: () => Weakness[];
}

function generateId(): string {
  return `w-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useWeaknessesStore = create<WeaknessesState>()(
  persist(
    (set, get) => ({
      weaknesses: [],
      addWeakness: (weakness) =>
        set((state) => ({
          weaknesses: [
            ...state.weaknesses,
            {
              ...weakness,
              id: generateId(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        })),
      updateWeakness: (id, updates) =>
        set((state) => ({
          weaknesses: state.weaknesses.map((w) =>
            w.id === id
              ? { ...w, ...updates, updated_at: new Date().toISOString() }
              : w
          ),
        })),
      removeWeakness: (id) =>
        set((state) => ({
          weaknesses: state.weaknesses.filter((w) => w.id !== id),
        })),
      archiveWeakness: (id) =>
        set((state) => ({
          weaknesses: state.weaknesses.map((w) =>
            w.id === id
              ? { ...w, status: "archived" as const, updated_at: new Date().toISOString() }
              : w
          ),
        })),
      setWeaknessStatus: (id, status) =>
        set((state) => ({
          weaknesses: state.weaknesses.map((w) =>
            w.id === id
              ? { ...w, status, updated_at: new Date().toISOString() }
              : w
          ),
        })),
      getActiveWeaknesses: () =>
        get().weaknesses.filter((w) => w.status !== "archived"),
    }),
    {
      name: "agapetoi-weaknesses",
    }
  )
);
