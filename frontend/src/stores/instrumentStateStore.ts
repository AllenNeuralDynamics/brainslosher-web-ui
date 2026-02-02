import { create } from "zustand";
import { useDataChannelStore } from "./dataChannelStore";

export type InstrumentStateStatus =
  | "failed"
  | "finished"
  | "running"
  | "paused"
  | "idle"
  | null;

export type InstrumentState = {
  status: InstrumentStateStatus;
  message: string;
};

type InstrumentStateState = {
  state: InstrumentStateStatus;
  setState: (state: InstrumentStateStatus) => void;
};

export const useInstrumentStateStore = create<InstrumentStateState>((set) => {
  let currentListener: ((evt: MessageEvent) => void) | null = null;

  const attachChannelListener = (channel: RTCDataChannel) => {
    // Remove previous listener from this channel
    if (currentListener) {
      channel.removeEventListener("message", currentListener);
    }

    currentListener = (evt: MessageEvent) => {
      try {
        const message: InstrumentState = JSON.parse(evt.data);
        const status = message.status;
        if (
          status === "running" ||
          status === "idle" ||
          status === "paused" ||
          status === "finished"
        ) {
          set({ state: status });
        } else if (status === "failed") {
          set({ state: status });
          window.dispatchEvent(
            new CustomEvent("error", { detail: { message: message.message } }),
          );
        } else {
          console.warn("Invalid instrument state received:", status);
        }
      } catch {
        console.warn("Failed to parse state message:", evt.data);
      }
    };

    channel.addEventListener("message", currentListener);
  };

  useDataChannelStore.subscribe((state, prevState) => {
    const newChannel = state.channels["check_job_status"];
    const oldChannel = prevState.channels["check_job_status"];

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
