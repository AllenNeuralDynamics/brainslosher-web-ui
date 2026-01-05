import { ProtocolForm } from "../../features/protocol/components/protocolForm.tsx"


export const HomePage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ProtocolForm/>
    </div>
  );
};
