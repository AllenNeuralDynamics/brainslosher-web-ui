export interface AppConfig {
  job_folder: string[];
  data_channels: string[];
  gets: Record<string, string>;
  posts: Record<string, string>;
}

export interface InstrumentConfig {
  selector_port_map: Record<string, number>;
  max_syringe_volume_ml: number;
  prime_volume_ml: number;
  purge_volume_ml: number;
  drain_volume_buffer_ml: number;
  fill_volume_ml: number;
}
