import { api } from "@/lib/client.tsx";
import type { BrainSlosherJobType } from "@/types/protocolType.tsx";

export const formApi = {
  postSaveForm: (form: BrainSlosherJobType) =>
    api.post(`/save_job`, { job: form }),
  postSetJob: (form: BrainSlosherJobType) =>
    api.post(`/set_job`, { job: form }),
  postClearJob: () =>
    api.post(`/clear_run`),
};
