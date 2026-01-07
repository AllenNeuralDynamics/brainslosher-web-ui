import { create } from "zustand";

type InstrumentState = "idle" | "running";

interface InstrumentStateStore {
  state: InstrumentState | null;
  setState: (state: InstrumentState) => void;
}

export const useInstrumentStateStore = create<InstrumentStateStore>((set) => ({
  state: null,
  setState: (state) => set({ state }),
}));
