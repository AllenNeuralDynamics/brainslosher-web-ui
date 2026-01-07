import { useEffect, useState } from "react";
import { NumberInput, Stack } from "@mantine/core";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";
import { washVolumeApi } from "../api/washVolumesApi";
import { api } from "../../../lib/client";

export const WashVolumes = () => {
  const instConfig = useInstrumentConfigStore((state) => state.config);
  const setInstConfig = useInstrumentConfigStore((state) => state.setConfig);
  const [washFill, setWashFill] = useState<number>();
  const [washDrain, setWashDrain] = useState<number>();

  useEffect(() => {
    setWashFill(instConfig?.fill_volume_ml);
    setWashDrain(instConfig?.drain_volume_buffer_ml);
  }, [instConfig]);

  async function updateInstrumentConfig() {
    try {
      const instConfig = await api.get("/instrument_config");
      setInstConfig({ ...instConfig.data });
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  return (
    <Stack>
      <NumberInput
        label="Fill Volume (mL)"
        required
        value={washFill}
        description={"Volume to fill chamber for each wash."}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = e.currentTarget.value;
            setWashFill(Number(val));
            washVolumeApi.postFillVolume(Number(val));
            updateInstrumentConfig();
          }
        }}
      />
      <NumberInput
        label="Drain Buffer (mL)"
        required
        value={washDrain}
        description={
          "Volume to add to fill volume when draining chamber to ensure all liquid is removed."
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = e.currentTarget.value;
            setWashDrain(Number(val));
            washVolumeApi.postDrainVolume(Number(val));
            updateInstrumentConfig();
          }
        }}
      />
    </Stack>
  );
};
