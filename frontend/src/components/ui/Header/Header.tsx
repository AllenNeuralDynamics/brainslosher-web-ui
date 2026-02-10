import { useState, useEffect } from "react";
import { Container, Title, TextInput, Group, Autocomplete } from "@mantine/core";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import { useInstrumentConfigStore } from "@/stores/instrumentConfigStore.ts";
import { api } from "@/lib/client.tsx";

async function loadEmails() {
  const res = await fetch('/emails.txt');
  const text = await res.text();

  // skip if file doesn't exist
  if (text.startsWith('<!DOCTYPE html>') || text.includes('<html')) {
      return [];
    }
    
  return text.split('\n').map(e => e.trim()).filter(Boolean);
}

export const Header = () => {
  const instConfig = useInstrumentConfigStore((state) => state.config);
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailSuggestions, setEmailSuggestions] = useState<Array<string>>([])

  useEffect(() => {
    if (!instConfig?.user_email) return;
    setUserEmail(instConfig.user_email);
  }, [instConfig?.user_email]);

  useEffect(() => {
  loadEmails().then(setEmailSuggestions);
}, []);


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
