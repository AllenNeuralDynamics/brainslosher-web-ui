import { create } from "zustand";

interface JobPathStore {
  jobPath: string;
  setJobPath: (path: string) => void;
}

export const usejobPathStore = create<JobPathStore>((set) => ({
  jobPath: "./brainslosher_job.json",
  setJobPath: (path) => set({ jobPath: path }),
}));