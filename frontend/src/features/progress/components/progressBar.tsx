import { Progress, Slider, Text, Group, Box, Title, Card } from "@mantine/core";
import { useState, useEffect } from "react";
import { useProtocolStore } from "../../../stores/protocolStore";
import { useThemeStore } from "../../../stores/themeStore";
import type { Protocol } from "../../protocol/types/protocolType";

type Marker = {
  percent: number;
  label: string;
  color: string;
};

type CycleCard = {
  startPercent: number;
  endPercent: number;
};

export const ProtocolProgress = () => {
  const protocol = useProtocolStore((state) => state.protocol);
  const theme = useThemeStore((state)=> state.colorScheme)
  const [progress, setProgress] = useState<number>(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const themeColors = {
    "light": ["#e0f2ff", "#f3f8fbff"],
    "dark": ["#1e3a5f", "#2c2c2c"]
    }
  const [cycleCards, setCycleCards] = useState<CycleCard[]>([
    {
      startPercent: 0,
      endPercent: 100,
    },
  ]);

  function buildMarkers(protocol: Protocol): Marker[] {
    const totalDuration = protocol.reduce(
      (sum, cycle) => sum + cycle.washes * cycle.duration_min,
      0,
    );

    let elapsedTime = 0;
    const markers: Marker[] = [];

    protocol.forEach((cycle, cycleIdx) => {
      for (let wash = 1; wash <= cycle.washes; wash++) {
        const percent = (elapsedTime / totalDuration) * 100;

        markers.push({
          percent: 100 - percent, // invert for vertical bar
          label: `Wash ${wash}`,
          color: cycleIdx % 2 === 0 ? "blue" : "#6ab5ebff",
        });

        elapsedTime += cycle.duration_min;
      }
    });

    return markers;
  }

  function buildCycleCards(protocol: Protocol): CycleCard[] {
    const totalDuration = protocol.reduce(
      (sum, cycle) => sum + cycle.washes * cycle.duration_min,
      0,
    );

    let elapsedTime = 0;
    const cards: CycleCard[] = [];

    protocol.forEach((cycle, cycleIdx) => {
      const cycleStart = (elapsedTime / totalDuration) * 100;
      const cycleDuration =
        ((cycle.washes * cycle.duration_min) / totalDuration) * 100;
      const cycleEnd = cycleStart + cycleDuration;

      cards.push({
        startPercent: 100 - cycleEnd, // invert for vertical bar
        endPercent: 100 - cycleStart,
      });

      elapsedTime += cycle.washes * cycle.duration_min;
    });

    return cards;
  }

  useEffect(() => {
    setMarkers(buildMarkers(protocol.protocol));
    setCycleCards(buildCycleCards(protocol.protocol));
  }, [protocol]);

  return (
    <Card
      shadow="m"
      padding="xl"
      radius="md"
      withBorder
      className="bg-gray-50"
      style={{
        borderColor: "#333",
        margin: "0.7rem",
        maxWidth: 600,
        height: "100%",
      }}
    >
      <Title
        style={{
          fontWeight: "bold",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Progress
      </Title>

      <Box
        style={{
          position: "relative",
          height: "100%",
          width: 40,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        {cycleCards.map((c, idx) => (
          <Box>
          <Box
            style={{
              position: "absolute",
              bottom: `${c.startPercent + 1 / 2}%`,
              height: `${c.endPercent - c.startPercent - 1}%`,
              width: 400,
              backgroundColor: themeColors[theme][idx % 2],
              borderRadius: 8,
              padding: 10,
              zIndex: 0,
            }}
          />
          <Text
              size="xl"
              style={{
                position: "absolute",
                bottom: `${c.startPercent + (c.endPercent - c.startPercent) / 2}%`,
                left: 300,
                transform: "translateY(-50%)",
                whiteSpace: "nowrap",
              }}
            > 
                Cycle {idx + 1}
            </Text>
            </Box>
        ))}
        <Progress
          size="xl"
          value={progress}
          orientation="vertical"
          radius="lg"
          style={{ width: 20 }}
        />
        {markers.map((m, idx) => (
          <Box
            key={idx}
            style={{
              position: "absolute",
              bottom: `calc(${m.percent}% - 20px)`,
              left: "30%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: m.color,
                marginLeft: 0,
              }}
            />
            <Text
              size="xl"
              style={{
                position: "absolute",
                left: 20, // offset text to the right of the circle
                top: "50%",
                transform: "translateY(-50%)",
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  );
};
