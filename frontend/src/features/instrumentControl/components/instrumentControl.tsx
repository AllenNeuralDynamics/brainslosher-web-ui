import { useState, useEffect, useRef } from "react";
import { Button, Group, Stack, NumberInput, Select } from "@mantine/core";
import { instrumentControlApi } from "../api/instrumentControlApi.ts";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";
import { useProtocolStore } from "@/stores/protocolStore.ts";
import { useAppConfigStore } from "@/stores/appConfigStore.ts";
import { useDataChannelStore } from "@/stores/dataChannelStore.ts";

export const InstrumentControl = () => {
  const [washFill, setWashFill] = useState<number>(11);
  const [solution, setSolution] = useState<string>("");
  const instConfig = useInstrumentConfigStore((state) => state.config);
  const protocol = useProtocolStore((state) => state.protocol);
  const setProtocol = useProtocolStore((state) => state.setProtocol);
  const uiConfing = useAppConfigStore((state) => state.config);
  const dataChannels = useDataChannelStore((state) => state.channels);
  const [state, setState] = useState("Paused");
  const stateChannelRef = useRef<RTCDataChannel | null>(null);

  // initialize and connect instrument state dataChannel
  useEffect(() => {
    // add state channel
    const stateChannel = dataChannels[`state`];
    if (!stateChannel) return;
    // update pos upon message
    const handleStateMessage = (evt: MessageEvent) => {
      const state = JSON.parse(evt.data);
      setState(state);
    };
    stateChannel.addEventListener("message", handleStateMessage);
    // create reference
    stateChannelRef.current = stateChannel;

    return () => {
      stateChannel.removeEventListener("message", handleStateMessage);
    };
  }, [dataChannels]);

  useEffect(() => {
    if (instConfig && Object.keys(instConfig.selector_port_map).length > 0) {
      setSolution(Object.keys(instConfig.selector_port_map)[0]);
    }
  }, [instConfig]);

  const options = instConfig
    ? Object.entries(instConfig.selector_port_map).map(([key, val]) => ({
        value: key,
        label: `${key}: Valve ${val}`,
      }))
    : [];

  function createJobPath(): string {
    const date = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .replace("Z", "");
    const path = `${uiConfing?.job_folder}${protocol.name}_${date}.yaml`;
    return path;
  }

  return (
    <Stack>
      <Group>
        <Button
          mt="md"
          color="blue"
          onClick={() => instrumentControlApi.postFill(solution, washFill)}
        >
          Fill
        </Button>
        <NumberInput
          label="Volume (mL)"
          required
          value={washFill}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = e.currentTarget.value;
              setWashFill(Number(val));
            }
          }}
        />
        <Select
          label="Solution"
          placeholder="Select a valve"
          data={options}
          value={solution}
          onChange={(val) => setSolution(val ?? "")}
        />
      </Group>
      <Button color="cyan"> Drain </Button>
      {(state == "idle" || state == null) && protocol.resume_state == null && (
        <Button
          color="green"
          onClick={() => {
            const path = createJobPath();
            instrumentControlApi.postStart(protocol, path);
          }}
        >
          Start
        </Button>
      )}
      {(state == "idle" || state == null) && protocol.resume_state != null && (
        <Button
          style={{ backgroundColor: "#D4A017" }}
          onClick={() => {
            const path = createJobPath();
            const newProtocol = { ...protocol, resume_state: null };
            setProtocol(newProtocol);
            instrumentControlApi.postStart(newProtocol, path);
          }}
        >
          Restart
        </Button>
      )}
      {(state == "idle" || state == null) && protocol.resume_state != null && (
        <Button
          color="orange"
          onClick={() => instrumentControlApi.postResume()}
        >
          Resume
        </Button>
      )}
      {state == "running" && (
        <Button color="orange" onClick={() => instrumentControlApi.postPause()}>
          Resume
        </Button>
      )}
    </Stack>
  );
};
