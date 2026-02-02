import { useRef, useEffect, useState } from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mantine";
import { Button, FileButton, Title, Card, Group } from "@mantine/core";
import {
  useProtocolSchema,
  useProtocolUiSchema,
} from "../types/protocolSchema";
import "../assets/rjsf-spacing.css";
import { WashVolumes } from "./washVolumes";
import { useProtocolStore } from "@/stores/protocolStore";
import { useInstrumentStateStore } from "@/stores/instrumentStateStore.ts";
import { useStartTimeSore } from "@/stores/startTimeStore.ts";
import { getEmptyJob } from "@/utils/getEmptyJob";
import type { BrainSlosherJobType } from "@/types/protocolType";
import { formApi } from "../api/formApi";
import yaml from "js-yaml";

export const ProtocolForm = () => {
  const protocolSchema = useProtocolSchema();
  const protocol = useProtocolStore((state) => state.protocol);
  const setStartTime = useStartTimeSore((state) => state.setStartTime);
  const setProtocol = useProtocolStore((state) => state.setProtocol);
  const state = useInstrumentStateStore((state) => state.state);
  const disabled = state == "running" || state == "paused";
  const resetRef = useRef<() => void>(null);
  const [formKey, setFormKey] = useState(0);

  // update start time when protocol updates
  useEffect(() => {
    const startEvent = protocol.history?.events?.find(
      (event) => event.type == "start",
    );

    if (startEvent) {
      const d = new Date(startEvent.timestamp);
      const formatted = d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setStartTime(formatted);
    } else {
      setStartTime("");
    }
  }, [protocol]);

  // load, validatem and post protocol when user presses load button
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
        const protocolData = parsedData as BrainSlosherJobType;
        formApi.postSetJob(protocolData);
        setProtocol(protocolData);
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
            key={`${state}-${formKey}`} // remount whenever state changes or clear button is pressed to reflect current protocol
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
                  resetRef.current?.(); // reset file secected
                }}
              >
                {(props) => <Button {...props}>Load Protocol</Button>}
              </FileButton>
              <Button
                m="xs"
                type="reset"
                onClick={() => {
                  const form = getEmptyJob();
                  setProtocol(form);
                  setFormKey(k => k + 1);
                  formApi.postClearJob();
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
