// Top stage-stepper navigation bar, rendered as a floating card over the 3D view.
// Driven by NavStepperMessage; clicking a step sends NavStepClickedMessage.
import { useContext } from "react";
import { Box, Paper, Text, Tooltip } from "@mantine/core";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { ViewerContext } from "./ViewerContext";
import { useThrottledMessageSender } from "./WebsocketUtils";

const ACTIVE = "#f2b705"; // amber highlight for the active step
const DONE = "#2fb344"; // green for completed steps
const IDLE = "#c8ccd4"; // grey for upcoming steps

export function StepperNav() {
  const viewer = useContext(ViewerContext)!;
  const nav = viewer.useGui((state) => state.nav);
  const darkMode = viewer.useGui((state) => state.theme.dark_mode);
  const send = useThrottledMessageSender(50).send;

  if (nav === null || nav.steps.length === 0) return null;

  const activeIndex = Math.max(
    0,
    nav.steps.findIndex((s) => s.id === nav.active),
  );

  return (
    <Box
      style={{
        position: "absolute",
        top: "0.9em",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        pointerEvents: "none",
        maxWidth: "min(94vw, 1200px)",
      }}
    >
      <Paper
        shadow="sm"
        radius="xl"
        px="lg"
        py={10}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.6em, 1.2vw, 1.1em)",
          maxWidth: "100%",
          overflowX: "auto",
          background: darkMode ? "rgba(30,32,38,0.92)" : "rgba(255,255,255,0.96)",
          backdropFilter: "blur(6px)",
          border: darkMode ? "1px solid #2c2f36" : "1px solid #ececf0",
        }}
      >
        {nav.title && (
          <Text fw={700} size="sm" style={{ paddingRight: "0.2em" }}>
            {nav.title}
          </Text>
        )}

        <IconChevronRight size="1.1em" color={IDLE} style={{ flexShrink: 0 }} />

        <Box style={{ display: "flex", alignItems: "flex-start" }}>
          {nav.steps.map((step, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            const color = active ? ACTIVE : done ? DONE : IDLE;
            return (
              <Box
                key={step.id}
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                {/* connector line from the previous node */}
                {i > 0 && (
                  <Box
                    style={{
                      width: "clamp(1em, 2.4vw, 2.4em)",
                      height: 2,
                      background: i <= activeIndex ? DONE : IDLE,
                      marginTop: "0.85em",
                      flexShrink: 0,
                    }}
                  />
                )}
                <Tooltip label={step.sublabel || step.label} withArrow>
                  <Box
                    onClick={() =>
                      send({ type: "NavStepClickedMessage", step_id: step.id })
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      width: "clamp(3.6em, 5.6vw, 5.4em)",
                      flexShrink: 0,
                      userSelect: "none",
                    }}
                  >
                    <Box
                      style={{
                        width: "clamp(1.5em, 1.9vw, 1.85em)",
                        height: "clamp(1.5em, 1.9vw, 1.85em)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85em",
                        fontWeight: 700,
                        color: active || done ? "#fff" : "#8a8f9a",
                        background: active || done ? color : "transparent",
                        border: `2px solid ${color}`,
                        boxShadow: active ? `0 0 0 4px ${ACTIVE}44` : "none",
                        transition: "all 120ms ease",
                      }}
                    >
                      {done ? <IconCheck size="1em" /> : i + 1}
                    </Box>
                    <Text
                      size="xs"
                      ta="center"
                      mt={4}
                      fw={active ? 700 : 500}
                      c={active ? undefined : "dimmed"}
                      style={{ lineHeight: 1.1 }}
                    >
                      {step.label}
                    </Text>
                  </Box>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
