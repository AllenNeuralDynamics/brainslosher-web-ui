import { useState, useEffect, } from "react";
import { Button, Group, Stack, NumberInput, Select} from "@mantine/core";
import { instrumentControlApi } from "../api/instrumentControlApi.ts";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";

export const InstrumentControl = () => {
    const [washFill, setWashFill] = useState<number>(11)
    const [solution, setSolution] = useState<string>("")
    const instConfig = useInstrumentConfigStore((state) => state.config);

      useEffect(() => {
        if (instConfig && Object.keys(instConfig.selector_port_map).length > 0) {
        setSolution(Object.keys(instConfig.selector_port_map)[0]);
        }
    }, [instConfig]);

    const options =
    instConfig
      ? Object.entries(instConfig.selector_port_map).map(([key, val]) => ({
          value: key,             
          label: `${key}: Valve ${val}`, 
        }))
      : [];

    return(
        <Stack>
          <Group>
            <Button mt="md" color="blue" onClick={() => instrumentControlApi.postFill(solution, washFill)}>Fill</Button>
            <NumberInput
                  label="Volume (mL)"  
                  required
                  value={washFill}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
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
          <Button color="green" onClick={() => instrumentControlApi.postStart()}>Start</Button>
          <Button color="orange" onClick={() => instrumentControlApi.postPause()}>Pause</Button>
          <Button color="red" onClick={() => instrumentControlApi.postStop()}>Stop</Button>
        </Stack>
  );
}
  