import { api } from "@/lib/client.tsx";
import type { BrainSlosherJobType } from "@/types/protocolType.tsx";

export const instrumentControlApi = {
  postFill: (solution: string, volume_ml: number) =>
    api.post(`/fill_chamber`, { solution, volume_ml }),
  postDrain: () => api.post(`/drain_chamber`),
  postWasteEmptied: () => api.post(`/waste_emptied`),
  postStart: (job: BrainSlosherJobType) => api.post(`/start_run`, { job }),
  postPause: () => api.post(`/pause_run`),
  postResume: () => api.post(`/resume_run`),
  postClear: () => api.post(`/clear_run`),
};
