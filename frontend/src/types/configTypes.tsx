export type AppConfig = {
  data_channels: string[];
  suggested_emails: string[];
  gets: Record<string, string>;
  posts: Record<string, string>;
};

export type InstrumentConfig = {
  selector_port_map: Record<string, number>;
  max_syringe_volume_ml: number;
  prime_volume_ml: number;
  purge_volume_ml: number;
  drain_volume_buffer_ml: number;
  fill_volume_ml: number;
  user_email: string | null;
};
