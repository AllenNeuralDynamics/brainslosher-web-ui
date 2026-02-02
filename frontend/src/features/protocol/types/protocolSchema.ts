import type { RJSFSchema } from "@rjsf/utils";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";

export const useProtocolSchema = (): RJSFSchema => {
  const instConfig = useInstrumentConfigStore((state) => state.config);

  const valveKeys = instConfig ? Object.keys(instConfig.selector_port_map) : [];

  return {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Job Name",
      },
      starting_solution: {
        type: "object",
        title: "Starting Solution",
        additionalProperties: {
          type: "number",
        },
      },
      source_protocol: {
        type: "object",
        title: "Source Protocol",
        properties: {
          path: {
            type: "string",
            title: "Protocol Path",
          },
          accessed: {
            type: ["string", "null"],
            format: "date-time",
            title: "Last Accessed",
          },
        },
      },
      protocol: {
        type: "array",
        title: "Cycle",
        items: {
          type: "object",
          properties: {
            solution: {
              description: "Solution used in all wash cycles",
              type: "string",
              enum: valveKeys,
              title: "Solution",
            },
            duration_min: {
              type: "number",
              title: "Duration (min)",
              description: "Duration in minutes of all washes in cycle.",
              default: 1,
              minimum: 1,
            },
            washes: {
              type: "number",
              title: "Number of washes",
              description: "Number of washes performed in cycle.",
              default: 1,
              minimum: 1,
            },
          },
          required: ["solution", "duration_min", "washes"],
        },
      },
      motor_speed_rpm: {
        type: "number",
        title: "Motor Speed (RPM)",
        description: "Speed of motor in rpms. Set to 0 to disable motor.",
        default: 0,
      },
      resume_state: {
        type: ["object", "null"],
        title: "Resume State",
        properties: {
          step: { type: "number", title: "Step" },
          starting_solution: {
            type: "object",
            title: "Starting Solution",
            additionalProperties: { type: "number" },
          },
          overrides: {
            type: "object",
            title: "Overrides",
            additionalProperties: {},
          },
        },
      },
      history: {
        type: "object",
        title: "History",
        properties: {
          events: {
            type: "array",
            title: "Events",
            items: {
              type: "object",
              properties: {
                timestamp: { type: "object" }, // Date type
                type: {
                  type: "string",
                  enum: ["start", "end", "pause", "resume"],
                },
              },
              required: ["timestamp", "type"],
            },
          },
        },
      },
    },
    required: ["name", "starting_solution", "protocol", "motor_speed_rpm"],
  };
};

export const useProtocolUiSchema = () => {
  const instConfig = useInstrumentConfigStore((state) => state.config);

  const valveLabels = instConfig
    ? Object.entries(instConfig.selector_port_map).map(
        ([label, value]) => `${label}: Valve ${value}`,
      )
    : [];

  return {
    name: {
      "ui:placeholder": "Enter job name",
      "ui:autoFocus": true,
    },
    starting_solution: {
      "ui:widget": "hidden",
    },
    source_protocol: {
      "ui:widget": "hidden",
    },
    protocol: {
      "ui:options": {
        label: false,
      },
      items: {
        solution: {
          "ui:widget": "select",
          "ui:placeholder": "Select solution",
          "ui.enumNames": valveLabels,
          "ui:options": {
            enumNames: valveLabels,
            searchable: false,
          },
        },
        duration_min: {
          "ui:widget": "updown",
          "ui:options": {
            step: 0.1,
          },
        },
        washes: {
          "ui:widget": "updown",
          "ui:options": {
            step: 1,
            min: 1,
          },
        },
      },
    },
    motor_speed_rpm: {
      "ui:widget": "updown",
      "ui:options": {
        step: 10,
        min: 0,
      },
    },
    resume_state: {
      "ui:widget": "hidden",
    },
    history: {
      "ui:widget": "hidden",
    },
  };
};
