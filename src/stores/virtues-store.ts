import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VirtuesState {
  focusId: string | null;
  customMappings: Record<string, string[]>;
  setFocus: (virtueId: string | null) => void;
  setCustomMapping: (weaknessId: string, virtueIds: string[]) => void;
}

export const useVirtuesStore = create<VirtuesState>()(
  persist(
    (set) => ({
      focusId: null,
      customMappings: {},
      setFocus: (virtueId) => set({ focusId: virtueId }),
      setCustomMapping: (weaknessId, virtueIds) =>
        set((state) => ({
          customMappings: {
            ...state.customMappings,
            [weaknessId]: virtueIds,
          },
        })),
    }),
    {
      name: "agapetoi-virtues",
    }
  )
);
