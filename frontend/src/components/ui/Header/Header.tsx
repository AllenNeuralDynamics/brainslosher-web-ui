import { useState, useEffect } from "react";
import { Container, Title, Group, Autocomplete } from "@mantine/core";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";
import { api } from "@/lib/client.tsx";
import { useAppConfigStore } from "@/stores/appConfigStore.ts";

export const Header = () => {
  const instConfig = useInstrumentConfigStore((state) => state.config);
  const [userEmail, setUserEmail] = useState<string>("");
  const uiConfig = useAppConfigStore((state) => state.config);
  const [emailSuggestions, setEmailSuggestions] = useState<Array<string>>([])

  useEffect(() => {
    if (!instConfig?.user_email) return;
    setUserEmail(instConfig.user_email);
  }, [instConfig?.user_email]);

  useEffect(() => {
    if (!uiConfig?.suggested_emails) return;
    setEmailSuggestions(uiConfig.suggested_emails);
  }, [uiConfig]);


  return (
    <Container
      fluid
      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      className="flex justify-between p-2 mb-[1rem]"
    >
      <Title order={1} style={{ fontWeight: 700 }}>
        Brain Slosher
      </Title>
      <Group ml="auto" gap="md">
        <Autocomplete
          label="Email"
          value={userEmail}
          data={emailSuggestions}
          onChange={(e) => setUserEmail(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const email = e.currentTarget.value;
              api.post(`/set_email`, { email });
              setUserEmail(email);
            }
          }}
        />
        <ColorSchemeToggle />
      </Group>
    </Container>
  );
};
