import { create } from "zustand";

type StartTimeStore = {
  startTime: string;
  setStartTime: (time: string) => void;
};

export const useStartTimeSore = create<StartTimeStore>((set) => ({
  startTime: "",
  setStartTime: (time) => set({ startTime: time }),
}));
