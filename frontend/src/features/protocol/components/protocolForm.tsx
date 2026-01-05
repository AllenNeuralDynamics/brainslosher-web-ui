import { useState } from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mantine";
import { Button, FileButton, Title, Card, Group } from "@mantine/core";
import { useProtocolSchema, useProtocolUiSchema } from "../types/protocolSchema"
import type { BrainSlosherJobType } from "../types/protocolType"
import "../assets/rjsf-spacing.css";
import { WashVolumes } from "./washVolumes";

export const getEmptyJob = (): BrainSlosherJobType => ({
  name: "",
  starting_solution: {},
  protocol: [],
  motor_speed_rpm: 0
  });

export const ProtocolForm = () => {
  const [protocolForm, setProtocol] = useState<BrainSlosherJobType>(getEmptyJob())
  

  const loadConfig = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result !== "string") return;
          const parsedData = JSON.parse(result);
          const validate = validator.ajv.compile(useProtocolSchema());
          const valid = validate(parsedData);
          if (!valid) {
            throw new Error("Loaded json is not valid");
          }
          setProtocol(parsedData as BrainSlosherJobType);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
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
      style={{ borderColor: '#333',
               margin: "0.7rem",
               maxWidth: 600
       }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520}}>
        <Title style={{ fontWeight: "bold", marginBottom: "0.5rem", textAlign: "center"}}> Protocol </Title>
        <Form
          uiSchema={useProtocolUiSchema()}
          schema={useProtocolSchema()}
          validator={validator}
          formData={protocolForm}
          onChange={(e) => setProtocol(e.formData)}
        >
          <WashVolumes />
          <Group style={{ justifyContent: "center" }}>
          <Button m="xs" type="submit">
            Submit
          </Button>
          <FileButton onChange={loadConfig} accept="json">
            {(props) => <Button {...props}>Load Protocol</Button>}
          </FileButton>
          <Button 
            m="xs" 
            type="button"
            onClick={() => {
              setProtocol(getEmptyJob())
            }}>
            Clear
          </Button>
          </Group>
        </Form>
      </div>
      </div>
    </Card>
  );


}
  