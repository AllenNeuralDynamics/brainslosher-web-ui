import { api } from "../../../lib/client.tsx";

export const instrumentControlApi = {
  postFill: (solution: string, volume_ml: number) =>
    api.post(`/fill_chamber`, { solution, volume_ml }),
  postDrain: () =>
    api.post(`/drain_chamber`),
  postStart: () =>
    api.post(`/start_run`),
  postPause: () =>
    api.post(`/pause_run`),
  postStop: () =>
    api.post(`/stop_run`),
};
