import { api } from "../../../lib/client.tsx";

export const washVolumeApi = {
  postFillVolume: (value: number) =>
    api.post(`/set_fill_volume`, { value }),
  postDrainVolume: (value: number) =>
    api.post(`/set_drain_volume`, { value }),
};
