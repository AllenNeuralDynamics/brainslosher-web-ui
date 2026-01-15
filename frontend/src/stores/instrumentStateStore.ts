import { create } from "zustand";
import { useDataChannelStore } from "./dataChannelStore";

export type InstrumentState = "running" | "idle" | "paused" | null;

interface InstrumentStateState {
  state: InstrumentState;
  setState: (state: InstrumentState) => void;
}

export const useInstrumentStateStore = create<InstrumentStateState>((set) => {
  let currentListener: ((evt: MessageEvent) => void) | null = null;

  const attachChannelListener = (channel: RTCDataChannel) => {
    // Remove previous listener from this channel
    if (currentListener) {
      channel.removeEventListener("message", currentListener);
    }

    currentListener = (evt: MessageEvent) => {
      try {
        const parsed = JSON.parse(evt.data);
        if (parsed === "running" || parsed === "idle" || parsed === "paused") {
          set({ state: parsed });
        } else {
          console.warn("Invalid instrument state received:", parsed);
        }
      } catch {
        console.warn("Failed to parse state message:", evt.data);
      }
    };

    channel.addEventListener("message", currentListener);
  };

  useDataChannelStore.subscribe((state, prevState) => {
    const newChannel = state.channels["state"];
    const oldChannel = prevState.channels["state"];

    if (oldChannel && currentListener && oldChannel !== newChannel) {
      oldChannel.removeEventListener("message", currentListener);
    }

    if (newChannel && oldChannel !== newChannel) {
      attachChannelListener(newChannel);
    }
  });

  return {
    state: null,
    setState: (state) => set({ state }),
  };
});
