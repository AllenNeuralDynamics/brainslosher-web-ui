import { useRef } from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mantine";
import { Button, FileButton, Title, Card, Group } from "@mantine/core";
import {
  useProtocolSchema,
  useProtocolUiSchema,
} from "../types/protocolSchema";
import type { BrainSlosherJobType } from "../types/protocolType";
import "../assets/rjsf-spacing.css";
import { WashVolumes } from "./washVolumes";
import { useProtocolStore } from "../../../stores/protocolStore";
import { useInstrumentStateStore } from "@/stores/instrumentStateStore.ts";
import { formApi } from "../api/formApi";
import yaml from "js-yaml";

const getEmptyJob = (): BrainSlosherJobType => ({
  name: "",
  starting_solution: {},
  protocol: [
    {
      solution: "",
      duration_min: 0,
      washes: 0,
    },
  ],
  motor_speed_rpm: 0,
});

export const ProtocolForm = () => {
  const protocolSchema = useProtocolSchema();
  const protocol = useProtocolStore((state) => state.protocol);
  const setProtocol = useProtocolStore((state) => state.setProtocol);
  const state = useInstrumentStateStore((state) => state.state);
  const disabled = state == "running" || state == "paused";
  const resetRef = useRef<() => void>(null);

  const loadProtocol = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result !== "string") return;
        const parsedData = yaml.load(result);

        const validate = validator.ajv.compile(protocolSchema);
        const valid = validate(parsedData);
        if (!valid) {
          console.log(parsedData);
          const errorMessage =
            validate.errors
              ?.map((err) => {
                const path = err.instancePath || "(root)";
                return `${path} ${err.message}`;
              })
              .join("\n") ?? "Schema validation failed";

          window.dispatchEvent(
            new CustomEvent("error", {
              detail: { message: errorMessage },
            }),
          );
          return;
        }
        setProtocol(parsedData as BrainSlosherJobType);
        formApi.postSetJob(parsedData as BrainSlosherJobType);
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  return (
    <Card
      shadow="m"
      padding="xl"
      radius="md"
      withBorder
      className="bg-gray-50"
      style={{
        borderColor: "#333",
        margin: "0.7rem",
        maxWidth: 600,
        pointerEvents: disabled ? "none" : "auto", // disable if state is not idle
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        className="protocol-form"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          <Title
            style={{
              fontWeight: "bold",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Protocol
          </Title>
          <Form
            uiSchema={useProtocolUiSchema()}
            schema={useProtocolSchema()}
            validator={validator}
            formData={protocol}
            onChange={(e) => setProtocol(e.formData)}
            disabled={disabled}
          >
            <WashVolumes />
            <Group style={{ justifyContent: "center" }}>
              <Button
                m="xs"
                onClick={() => {
                  formApi.postSaveForm(protocol);
                }}
              >
                Save
              </Button>
              <FileButton
                resetRef={resetRef}
                accept=".yaml,.yml"
                onChange={(file) => {
                  loadProtocol(file);
                  resetRef.current?.();   // reset file secected
                }}
              >
                {(props) => <Button {...props}>Load Protocol</Button>}
              </FileButton>
              <Button
                m="xs"
                type="button"
                onClick={() => {
                  setProtocol(getEmptyJob());
                }}
              >
                Clear
              </Button>
            </Group>
          </Form>
        </div>
      </div>
    </Card>
  );
};
