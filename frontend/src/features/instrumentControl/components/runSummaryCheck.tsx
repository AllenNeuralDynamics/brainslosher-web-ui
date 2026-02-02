import { Modal, Text, Button } from "@mantine/core";
import { useProtocolStore } from "@/stores/protocolStore.ts";
import type { Protocol } from "@/types/protocolType";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";
import type { InstrumentConfig } from "@/types/configTypes.tsx";

type ProtocolStartConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

type CalculateProps = {
  protocol: Protocol;
  instConfig: InstrumentConfig;
};

function calculateWaste({ protocol, instConfig }: CalculateProps): number {
  let totalWaste = 0;
  for (const cycle of protocol) {
    totalWaste += cycle.washes * instConfig.fill_volume_ml;
  }

  return totalWaste;
}

function calculateSolution({
  protocol,
  instConfig,
}: CalculateProps): Record<string, number> {
  let totalSolutions: Record<string, number> = {};
  for (const cycle of protocol) {
    if (!(cycle.solution in totalSolutions)) {
      totalSolutions[cycle.solution] = 0;
    }
    totalSolutions[cycle.solution] += cycle.washes * instConfig.fill_volume_ml;
  }
  return totalSolutions;
}

export function RunSummaryModal({
  opened,
  onClose,
  onConfirm,
}: ProtocolStartConfirmModalProps) {
  const protocol = useProtocolStore((state) => state.protocol.protocol);
  const instConfig = useInstrumentConfigStore((state) => state.config);

  if (!protocol || !instConfig) return null; // don't render until both exist

  const totalSolutions = calculateSolution({ protocol, instConfig });
  const waste = calculateWaste({ protocol, instConfig });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" style={{ fontWeight: 700 }}>
          Protocol Volume Summary
        </Text>
      }
      centered
    >
      <div style={{ marginBottom: "1rem" }}>
        <Text style={{ fontWeight: 700 }}>Protocol will use:</Text>
        <ul
          style={{
            marginLeft: "1.5rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {Object.entries(totalSolutions).map(([key, value]) => (
            <li key={key}>
              - {value} mL of {key}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text style={{ fontWeight: 700 }}>Protocol will produce:</Text>
        <ul
          style={{
            marginLeft: "1.5rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <li>- {waste} mL of waste</li>
        </ul>
      </div>

      <Text>
        Please ensure containers have adequate solution and waste has adequate
        capacity.
      </Text>

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="green">
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
