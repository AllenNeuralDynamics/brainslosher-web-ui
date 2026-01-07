import { api } from "../../../lib/client.tsx";
import type { BrainSlosherJobType } from "../../protocol/types/protocolType.tsx";

export const instrumentControlApi = {
  postFill: (solution: string, volume_ml: number) =>
    api.post(`/fill_chamber`, { solution, volume_ml }),
  postDrain: () => api.post(`/drain_chamber`),
  postStart: (job: BrainSlosherJobType, job_path: string) =>
    api.post(`/start_run`, { job, job_path }),
  postPause: () => api.post(`/pause_run`),
  postResume: () => api.post(`/resume_run`),
};
