import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JournalEntry } from "@/types";

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, "id" | "created_at">) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  removeEntry: (id: string) => void;
  getTodayEntry: () => JournalEntry | undefined;
  getRecentEntries: (count: number) => JournalEntry[];
}

function generateId(): string {
  return `j-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: generateId(),
              created_at: new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      getTodayEntry: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().entries.find((e) => e.created_at.startsWith(today));
      },
      getRecentEntries: (count) => get().entries.slice(0, count),
    }),
    {
      name: "agapetoi-journal",
    }
  )
);
