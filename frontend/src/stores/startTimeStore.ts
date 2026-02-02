import { create } from "zustand";

interface StartTimeStore {
  startTime: string;
  setStartTime: (time: string) => void;
}

export const useStartTimeSore = create<StartTimeStore>((set) => ({
  startTime: "",
  setStartTime: (time) => set({ startTime: time }),
}));
