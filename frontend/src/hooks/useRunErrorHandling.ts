import { useEffect, useRef } from "react";
import { useDataChannelStore } from "@/stores/dataChannelStore"; 

// need to handle error raised in run thread differently since errors do not occur during http call. 
// error_check dataChannel will return any errors that need to be raised
export function UseRunErrorHandling() {
    const dataChannels = useDataChannelStore((state) => state.channels)
    const errorChannelRef = useRef<RTCDataChannel | null>(null);

    // set up error data channel
    useEffect(() => {
      const errorChannel = dataChannels[`error_check`];
      if (!errorChannel) return; 
    
    const handleErrorMessage = (evt: MessageEvent) => {
      const error = JSON.parse(evt.data);
      if (!error) return;
      window.dispatchEvent(new CustomEvent("error", { detail: {message: error} }));
    };
    errorChannel.addEventListener("message", handleErrorMessage);
    
    // create reference
    errorChannelRef.current = errorChannel;

    return () => {
      errorChannel.removeEventListener("message", handleErrorMessage);

    };
  }, [dataChannels[`error_check`]]);
} 