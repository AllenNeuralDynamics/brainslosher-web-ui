import { Modal, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useInstrumentStateStore } from "@/stores/instrumentStateStore";
import { useProtocolStore } from "@/stores/protocolStore.ts";
import { getEmptyJob } from "@/utils/getEmptyJob";

export const FinishModal = () => {
  const status = useInstrumentStateStore((s) => s.state);
  const setProtocol = useProtocolStore((state) => state.setProtocol);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (status === "finished") {
      setOpened(true);
      // clear protocol to avoid resume state and history confusion
      setProtocol(getEmptyJob())
    }
  }, [status]);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Job finished 🎉"
      centered
    >
      <Text>The protocol has completed successfully!</Text>
    </Modal>
  );
};
