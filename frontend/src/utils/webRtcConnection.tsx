import { api } from "@/lib/client.tsx";

/**
 * negotiate function for establishing sdp and ice with webRTC peer connections
 *
 * @param pc - peer connection to use
 */

export async function negotiate(pc: RTCPeerConnection) {
  // create offer
  const offer = await pc.createOffer();
  // set offer as local description
  await pc.setLocalDescription(offer);

  // wait for ice gathering
  await new Promise<void>((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
    } else {
      function checkState() {
        if (pc.iceGatheringState === "complete") {
          pc.removeEventListener("icegatheringstatechange", checkState);
          resolve();
        }
      }
      pc.addEventListener("icegatheringstatechange", checkState);
    }
  });

  // send offer to server
  const localDescription = pc.localDescription;

  if (!localDescription) {
    throw new Error("PeerConnection localDescription is not set yet");
  }

  const response = await api.post("/offer", {
    sdp: localDescription.sdp,
    type: localDescription.type,
  });

  await pc.setRemoteDescription(response.data);
}
