import { Group } from "@mantine/core";
import { ProtocolForm } from "../../features/protocol/components/protocolForm.tsx";
import { InstrumentControl } from "@/features/instrumentControl/index.ts";

export const HomePage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Group>
        <ProtocolForm />
        <InstrumentControl />
      </Group>
    </div>
  );
};
