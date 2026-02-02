import { create } from "zustand";

type DataChannelState = {
  channels: Record<string, RTCDataChannel>;
  addChannel: (id: string, channel: RTCDataChannel) => void;
};

export const useDataChannelStore = create<DataChannelState>((set) => ({
  channels: {},
  addChannel: (id: string, channel: RTCDataChannel) =>
    set((state) => ({ channels: { ...state.channels, [id]: channel } })),
}));
