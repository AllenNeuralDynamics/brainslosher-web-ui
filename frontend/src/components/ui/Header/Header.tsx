import { Container, Title } from "@mantine/core";
import { ColorSchemeToggle } from "../ColorSchemeToggle";

export const Header = () => {
  return (
    <Container
      fluid
      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      className="flex justify-between p-2 mb-[1rem]"
    >
      <Title order={1} style={{ fontWeight: 700 }}>
        Brain Slosher
      </Title>
      <ColorSchemeToggle />
    </Container>
  );
};
