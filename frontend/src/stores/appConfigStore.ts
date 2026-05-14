import { create } from "zustand";
import type { AppConfig } from "@/types/configTypes.tsx";

type AppConfigStore = {
  config: AppConfig | null;
  setConfig: (cfg: AppConfig) => void;
};

export const useAppConfigStore = create<AppConfigStore>((set) => ({
  config: null,
  setConfig: (cfg) => set({ config: cfg }),
}));
