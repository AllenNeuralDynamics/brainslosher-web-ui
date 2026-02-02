import { api } from "@/lib/client.tsx";

export const washVolumeApi = {
  postFillVolume: (volume: number) => api.post(`/set_fill_volume`, { volume }),
  postDrainVolume: (volume: number) =>
    api.post(`/set_drain_volume`, { volume }),
};
