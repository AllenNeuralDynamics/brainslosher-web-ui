import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Stack, NumberInput, Select } from "@mantine/core";
import { instrumentControlApi } from "../api/instrumentControlApi.ts";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";
import { useProtocolStore } from "@/stores/protocolStore.ts";
import { useInstrumentStateStore } from "@/stores/instrumentStateStore.ts";
import {
  IconAlertHexagon,
  IconTrash,
  IconArrowNarrowDownDashed,
  IconArrowNarrowUpDashed,
  IconPlayerPlay,
  IconRotateClockwise,
  IconPlayerPause,
} from "@tabler/icons-react";
import { RunSummaryModal } from "./runSummaryCheck.tsx";

export const InstrumentControl = () => {
  const [washFill, setWashFill] = useState<number>(11);
  const [solution, setSolution] = useState<string>("");
  const instConfig = useInstrumentConfigStore((state) => state.config);
  const protocol = useProtocolStore((state) => state.protocol);
  const state = useInstrumentStateStore((state) => state.state);
  const [opened, { open, close }] = useDisclosure(false);

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

  return (
    <Stack>
      <RunSummaryModal
        opened={opened}
        onClose={close}
        onConfirm={() => {
          instrumentControlApi.postStart(protocol);
          close();
        }}
      />
      <Group>
        <Button
          mt="md"
          disabled={state != "idle" && state != "paused"}
          leftSection={<IconArrowNarrowUpDashed />}
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
      <Group grow>
        <Button
          color="rgb(56, 142, 190)"
          disabled={state != "idle" && state != "paused"}
          leftSection={<IconArrowNarrowDownDashed />}
          onClick={() => {
            instrumentControlApi.postDrain();
          }}
        >
          Drain Chamber
        </Button>
        <Button
          color="rgb(124, 108, 186)"
          leftSection={<IconTrash />}
          onClick={() => {
            instrumentControlApi.postWasteEmptied(); //TODO: Add pop up to confirm
          }}
        >
          Waste Emptied
        </Button>
      </Group>
      {(state == "idle" || state == null) &&
        protocol.history?.events == null && (
          <Button
            color="rgb(46, 204, 113)"
            leftSection={<IconPlayerPlay />}
            onClick={open}
          >
            Start
          </Button>
        )}
      {state == "paused" && (
        <Button
          color="rgb(230, 126, 34)"
          leftSection={<IconRotateClockwise />}
          onClick={open}
        >
          Restart
        </Button>
      )}
      {state == "paused" && (
        <Button
          leftSection={<IconPlayerPlay />}
          color="rgb(88, 204, 164)"
          onClick={() => instrumentControlApi.postResume()}
        >
          Resume
        </Button>
      )}
      {state == "paused" && (
        <Button
          leftSection={<IconAlertHexagon />}
          color="red"
          onClick={() => instrumentControlApi.postClear()}
        >
          Clear Current Protocol
        </Button>
      )}
      {state == "running" && (
        <Button
          color="rgb(241, 196, 15)"
          onClick={() => instrumentControlApi.postPause()}
          leftSection={<IconPlayerPause />}
        >
          Pause
        </Button>
      )}
    </Stack>
  );
};
