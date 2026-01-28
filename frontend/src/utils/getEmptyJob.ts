import type { BrainSlosherJobType } from "@/types/protocolType";

export const getEmptyJob = (): BrainSlosherJobType => ({
  name: "brainslosher",
  starting_solution: {},
  protocol: [
    {
      solution: "",
      duration_min: 1,
      washes: 1,
    },
  ],
  motor_speed_rpm: 0,
});
