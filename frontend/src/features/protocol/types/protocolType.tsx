export type ResumeState = {
  step: number;
  starting_solution: Record<string, number>;
  overrides?: Record<string, any>;
};

export type EventType = "start" | "end" | "pause" | "resume";

export type Event = {
  timestamp: string; // ISO datetime
  type: EventType;
};

export type History = {
  events?: Event[];
};

export type SourceProtocol = {
  path?: string;
  accessed?: string; // ISO datetime
};

// TypeScript type for a single cycle
export type Cycle = {
  solution: string;        // Solution to use in all washes of cycle
  duration_min: number;    // Duration in minutes
  washes: number;          // Number of washes
};

// Type for the protocol (array of cycles)
export type Protocol = Cycle[];

export type BrainSlosherJobType = {
  name: string;
  starting_solution: Record<string, number>;
  source_protocol?: SourceProtocol;
  protocol: Protocol;
  motor_speed_rpm: number;
  resume_state?: ResumeState;
  history?: History;
};
