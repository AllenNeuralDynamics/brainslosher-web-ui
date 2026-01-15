import { create } from "zustand";
import { useDataChannelStore } from "./dataChannelStore";

interface ProgressState {
  progress: number | null;
  setProgress: (progress: number) => void;
}

export const useProgressStore = create<ProgressState>((set) => {
  let currentListener: ((evt: MessageEvent) => void) | null = null;

  const attachChannelListener = (channel: RTCDataChannel) => {
    if (currentListener) {
      channel.removeEventListener("message", currentListener);
    }

    currentListener = (evt: MessageEvent) => {
      try {
        const parsed = JSON.parse(evt.data);
        if (typeof parsed === "number") {
          set({ progress: parsed });
        } else {
          console.warn("Invalid progress message:", evt.data);
        }
      } catch {
        console.warn("Failed to parse progress message:", evt.data);
      }
    };

    channel.addEventListener("message", currentListener);
  };

  useDataChannelStore.subscribe((state, prevState) => {
    const newChannel = state.channels["progress"];
    const oldChannel = prevState.channels["progress"];

    if (oldChannel && currentListener && oldChannel !== newChannel) {
      oldChannel.removeEventListener("message", currentListener);
    }

    if (newChannel && oldChannel !== newChannel) {
      attachChannelListener(newChannel);
    }
  });

  return {
    progress: null,
    setProgress: (progress) => set({ progress }),
  };
});
