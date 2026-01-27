import { Group, Stack } from "@mantine/core";
import { ProtocolForm } from "../../features/protocol/components/protocolForm.tsx";
import { InstrumentControl } from "@/features/instrumentControl/index.ts";
import { ProtocolProgress } from "@/features/progress/components/progressBar.tsx";
import { FinishModal } from "@/components/ui/FinishModal/finishModal.tsx";

export const HomePage = () => {
  return (
    <div>
      <FinishModal />
      <Group style={{ alignItems: "stretch", justifyContent: "center" }}>
        <ProtocolForm />
        <Stack>
          <ProtocolProgress />
          <InstrumentControl />
        </Stack>
      </Group>
    </div>
  );
};
