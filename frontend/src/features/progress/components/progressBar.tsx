import { Progress, Text, Box, Title, Card, Group, Stack } from "@mantine/core";
import { useState, useEffect } from "react";
import { useProtocolStore } from "../../../stores/protocolStore";
import { useThemeStore } from "../../../stores/themeStore";
import type { Protocol } from "../../../types/protocolType";
import { useStartTimeSore } from "@/stores/startTimeStore.ts";
import { useProgressStore } from "@/stores/progressStore";
import { useInstrumentStateStore } from "@/stores/instrumentStateStore.ts";

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
  const state = useInstrumentStateStore((state) => state.state);
  const protocol = useProtocolStore((state) => state.protocol);
  const theme = useThemeStore((state) => state.colorScheme);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const themeColors = {
    light: ["#e0f2ff", "#f3f8fbff"],
    dark: ["#1e3a5f", "#2c2c2c"],
  };
  const [cycleCards, setCycleCards] = useState<CycleCard[]>([
    {
      startPercent: 0,
      endPercent: 100,
    },
  ]);
  const [duration, setDuration] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const startTime = useStartTimeSore((state) => state.startTime);
  const [endTime, setEndTime] = useState<string>("");
  const progress = useProgressStore((state) => state.progress);

  // Calculate total duration
  useEffect(() => {
    if (!protocol?.protocol || protocol.protocol.length === 0) {
      setDuration(null);
      return;
    }

    // Total duration in minutes
    const totalDuration = protocol.protocol.reduce(
      (sum, cycle) => sum + cycle.washes * cycle.duration_min,
      0,
    );

    setDuration(totalDuration);
  }, [protocol]);

  // Calculate remaining time
  useEffect(() => {
    if (!duration) {
      setRemaining(null);
      return;
    }

    const remainingTime = duration * (1 - progress / 100);
    setRemaining(Math.round(remainingTime * 100) / 100);
  }, [progress, duration]);

  // Calculate end time
  useEffect(() => {
    if (!remaining || state != "running") {
      setEndTime("");
      return;
    }

    const nowDate = new Date();
    const endDate = new Date(nowDate.getTime() + remaining * 60_000);
    const formatted = endDate.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    setEndTime(formatted);
  }, [state]);

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
          color: cycleIdx % 2 === 0 ? "lightblue" : "#8798a5ff",
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

    protocol.forEach((cycle) => {
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

  function formatMinutes(totalMinutes: number | null): string | null {
    if (!totalMinutes) return null;

    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const rawMinutes = totalMinutes % 60;

    const parts: string[] = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);

    if (totalMinutes < 1) {
      // Show seconds if under a minute
      const seconds = Math.round(totalMinutes * 60);
      parts.push(`${seconds}s`);
    } else {
      // Show minutes, keeping fractions if any
      const minutes =
        rawMinutes % 1 === 0 ? rawMinutes : parseFloat(rawMinutes.toFixed(2));
      if (minutes || parts.length === 0) parts.push(`${minutes}m`);
    }

    return parts.join(" ");
  }

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
      <Group>
        <Title
          style={{
            fontWeight: "bold",
            marginBottom: "4rem",
            textAlign: "center",
          }}
        >
          Progress
        </Title>
        <Stack
          ml="xl"
          style={{
            marginBottom: "3rem",
          }}
        >
          <Text>Duration: {formatMinutes(duration)}</Text>
          <Text>Remaining: {formatMinutes(remaining)}</Text>
        </Stack>
      </Group>
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
          value={100 - progress}
          orientation="vertical"
          radius="lg"
          style={{ width: 20 }}
          color="lightgray"
          styles={{
            root: { backgroundColor: "blue" },
          }}
        />
        <Box // start time box
          key="startTime"
          style={{
            position: "absolute",
            bottom: `calc(105% - 20px)`,
            left: "-50%",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <Text
            size="md"
            style={{
              position: "absolute",
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            {startTime}
          </Text>
        </Box>
        <Box // end time box
          key="endTime"
          style={{
            position: "absolute",
            bottom: `calc(-1.5% - 20px)`,
            left: "-50%",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <Text
            size="md"
            style={{
              position: "absolute",
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            {endTime}
          </Text>
        </Box>
        {markers.map((m, idx) => (
          <Box
            key={idx}
            style={{
              position: "absolute",
              bottom: `calc(${m.percent - 2}% - 20px)`,
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
                marginLeft: -4,
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
