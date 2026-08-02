import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ExamenEntry, ExamenResponse } from "@/types";

interface ExamenState {
  entries: ExamenEntry[];
  saveEntry: (entry: { date: string; responses: ExamenResponse[] }) => void;
  updateEntry: (id: string, responses: ExamenResponse[]) => void;
  archiveEntry: (id: string) => void;
  restoreEntry: (id: string) => void;
  removeEntry: (id: string) => void;
}

function generateId(): string {
  return `e-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const useExamenStore = create<ExamenState>()(
  persist(
    (set) => ({
      entries: [],
      saveEntry: (entry) =>
        set((state) => {
          const existing = state.entries.find((item) => item.date === entry.date);
          const saved: ExamenEntry = existing
            ? {
                ...existing,
                responses: entry.responses,
                created_at: new Date().toISOString(),
                archived: false,
              }
            : {
                ...entry,
                id: generateId(),
                created_at: new Date().toISOString(),
                archived: false,
              };

          return {
            entries: [
              saved,
              ...state.entries.filter((item) => item.id !== saved.id),
            ],
          };
        }),
      updateEntry: (id, responses) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, responses, created_at: new Date().toISOString() }
              : entry
          ),
        })),
      archiveEntry: (id) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, archived: true } : entry
          ),
        })),
      restoreEntry: (id) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, archived: false } : entry
          ),
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
    }),
    { name: "agapetoi-examen" }
  )
);
