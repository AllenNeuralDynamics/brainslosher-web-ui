import { create } from "zustand";
import type { BrainSlosherJobType } from "../types/protocolType";
import { getEmptyJob } from "@/utils/getEmptyJob";

interface ProtocolStore {
  protocol: BrainSlosherJobType;
  setProtocol: (protocol: BrainSlosherJobType) => void;
}

export const useProtocolStore = create<ProtocolStore>((set) => ({
  protocol: getEmptyJob(),
  setProtocol: (protocol) => set({ protocol }),
}));
