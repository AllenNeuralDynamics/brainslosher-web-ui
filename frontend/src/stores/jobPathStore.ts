import { create } from "zustand";

interface JobPathStore {
  jobPath: string | null;
  setJobPath: (path: string) => void;
}

export const useJobPathStore = create<JobPathStore>((set) => ({
  jobPath: null,
  setJobPath: (path) => set({ jobPath: path }),
}));
