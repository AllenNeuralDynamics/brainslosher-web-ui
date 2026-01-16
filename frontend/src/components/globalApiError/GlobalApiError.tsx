import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface GlobalApiErrorProps {
  children: ReactNode;
}

export const GlobalApiError = ({ children }: GlobalApiErrorProps) => {
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const handler = (e: any) => setError(e.detail);
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  return (
    <>
      {children}

      {error && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setError(null)} // close modal when clicking outside
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              minWidth: "300px",
              maxWidth: "90%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking modal content
          >
            <h2 style={{ marginBottom: "1rem" }}>
              Error {error.status ? `(${error.status})` : ""}
            </h2>
            <p style={{ marginBottom: "1rem" }}>{error.message}</p>
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: "#f56565",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
