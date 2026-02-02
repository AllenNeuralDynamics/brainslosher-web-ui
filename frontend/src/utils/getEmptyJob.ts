import type { BrainSlosherJobType } from "@/types/protocolType";

export const getEmptyJob = (): BrainSlosherJobType => ({
  name: "brainslosher",
  starting_solution: {},
  protocol: [
    {
      solution: undefined as unknown as string, // raise validation error if not filled in by user
      duration_min: 1,
      washes: 1,
    },
  ],
  motor_speed_rpm: 0,
});
