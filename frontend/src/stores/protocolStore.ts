import { create } from "zustand";
import type { BrainSlosherJobType } from "../features/protocol/types/protocolType";

const getEmptyJob = (): BrainSlosherJobType => ({
  name: "brainslosher",
  starting_solution: {},
  protocol: [
    {
      solution: "air",
      duration_min: 1,
      washes: 1,
    },
  ],
  motor_speed_rpm: 0,
});

interface ProtocolStore {
  protocol: BrainSlosherJobType;
  setProtocol: (protocol: BrainSlosherJobType) => void;
}

export const useProtocolStore = create<ProtocolStore>((set) => ({
  protocol: getEmptyJob(),
  setProtocol: (protocol) => set({ protocol }),
}));
