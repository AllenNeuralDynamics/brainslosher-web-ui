import { Modal, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useInstrumentStateStore } from "@/stores/instrumentStateStore";

export const FinishModal = () => {
  const status = useInstrumentStateStore((s) => s.state);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (status === "finished") {
      setOpened(true);
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
