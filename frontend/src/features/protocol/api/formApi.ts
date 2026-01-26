import { api } from "../../../lib/client.tsx";
import type { BrainSlosherJobType } from "../types/protocolType";

export const formApi = {
  postSaveForm: (form: BrainSlosherJobType) =>
    api.post(`/save_job`, { job: form }), 
  postSetJob: (form: BrainSlosherJobType) =>
    api.post(`/set_job`, { job: form })
};
