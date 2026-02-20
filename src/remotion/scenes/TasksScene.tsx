import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { WiiPanel } from "../components/WiiPanel";
import { CyanOrb } from "../components/CyanOrb";

const TASKS = ["Design mockups", "Write docs", "Ship it"];
const TASK_DELAYS = [0, 20, 40];

export const TasksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <CyanOrb scale={1} opacity={0.4} />

      {/* Timer static in background */}
      <span
        style={{
          fontSize: 140,
          fontWeight: 300,
          letterSpacing: -6,
          color: "#9ca3af",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          textShadow: "1px 1px 0px rgba(255,255,255,1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        25:00
      </span>

      {/* Task List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 420,
          position: "relative",
          zIndex: 10,
        }}
      >
        {TASKS.map((task, i) => {
          const taskSpring = spring({
            frame: frame - TASK_DELAYS[i],
            fps,
            config: { damping: 14, stiffness: 200 },
          });

          const taskOpacity = interpolate(
            frame,
            [TASK_DELAYS[i], TASK_DELAYS[i] + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const taskY = interpolate(taskSpring, [0, 1], [-20, 0]);
          const taskScale = interpolate(taskSpring, [0, 1], [0.9, 1]);

          return (
            <React.Fragment key={task}>
              {frame >= TASK_DELAYS[i] && frame < TASK_DELAYS[i] + 2 && (
                <Audio
                  src={staticFile("sound-fx/button-press.wav")}
                  volume={0.3}
                />
              )}
              <WiiPanel
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: taskOpacity,
                  transform: `translateY(${taskY}px) scale(${taskScale})`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2px solid #d1d5db",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#4b5563",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {task}
                </span>
              </WiiPanel>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
