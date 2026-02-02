import { create } from "zustand";
import type { InstrumentConfig } from "@/types/configTypes.tsx";

type InstrumentConfigStore = {
  config: InstrumentConfig | null;
  setConfig: (cfg: InstrumentConfig) => void;
}

export const useInstrumentConfigStore = create<InstrumentConfigStore>(
  (set) => ({
    config: null,
    setConfig: (cfg) => set({ config: cfg }),
  }),
);
