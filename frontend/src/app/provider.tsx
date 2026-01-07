import { useEffect, Suspense, useState } from "react";
import { Loader, MantineProvider } from "@mantine/core";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDataChannelStore } from "@/stores/dataChannelStore.ts";
import { negotiate } from "@/utils/webRtcConnection.tsx";
import { MainErrorFallback } from "@/components/errors/main";
import { queryConfig } from "@/lib/react-query";
import { api } from "../lib/client.tsx";
import { useThemeStore } from "@/stores/themeStore";
import { useAppConfigStore } from "@/stores/appConfigStore.ts";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const addChannel = useDataChannelStore((state) => state.addChannel);
  const setUiConfig = useAppConfigStore((state) => state.setConfig);
  const uiConfig = useAppConfigStore((state) => state.config);
  const setInstConfig = useInstrumentConfigStore((state) => state.setConfig);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  //  fetch ui config
  useEffect(() => {
    async function fetchUiConfig() {
      try {
        const uiConfig = await api.get("/ui_config");
        setUiConfig({ ...uiConfig.data });
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    }
    fetchUiConfig();
  }, [setUiConfig]);

  // populate dataChannels
  useEffect(() => {
    if (!uiConfig) return;
    const pc = new RTCPeerConnection();

    for (const channel of uiConfig.data_channels) {
      const newChannel = pc.createDataChannel(channel);
      addChannel(channel, newChannel);
    }

    negotiate(pc);

    return () => {
      pc.close();
    };
  }, [uiConfig, addChannel]);

  //  grab instrument config
  useEffect(() => {
    async function fetchInstrumentConfig() {
      try {
        const instConfig = await api.get("/instrument_config");
        setInstConfig({ ...instConfig.data });
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    }
    fetchInstrumentConfig();
  }, [setInstConfig]);

  const colorScheme = useThemeStore((state) => state.colorScheme);

  // Set root dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colorScheme]);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Loader color="green" size="xl" />
        </div>
      }
    >
      <MantineProvider>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ErrorBoundary>
      </MantineProvider>
    </Suspense>
  );
};
