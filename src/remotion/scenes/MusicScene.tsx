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
import { CyanOrb } from "../components/CyanOrb";

const BAR_HEIGHTS = [12, 8, 14, 6];

export const MusicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timer still running in background
  const secondsElapsed = Math.floor(frame / 30) + 5;
  const totalSeconds = 25 * 60 - secondsElapsed;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Player slides up
  const playerY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
    from: 100,
    to: 0,
  });

  const playerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scrolling text
  const scrollX = interpolate(frame, [0, 90], [200, -250]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Audio
        src={staticFile("sound-fx/main-theme.wav")}
        volume={(f) =>
          interpolate(f, [0, 20], [0, 0.15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      <CyanOrb scale={1.3} opacity={0.7} />

      {/* Timer still visible */}
      <span
        style={{
          fontSize: 140,
          fontWeight: 300,
          letterSpacing: -6,
          color: "#4b5563",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          zIndex: 10,
        }}
      >
        {timerText}
      </span>

      {/* Music Player Bar */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "10px 28px",
          borderRadius: 9999,
          background:
            "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          border: "1px solid #d1d5db",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
          opacity: playerOpacity,
          transform: `translateY(${playerY}px)`,
        }}
      >
        {/* Music icon */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#22d3ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>

        {/* Text area */}
        <div style={{ width: 160, overflow: "hidden" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              fontFamily: "system-ui, sans-serif",
              marginBottom: 2,
            }}
          >
            Now Playing
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              fontSize: 13,
              fontWeight: 500,
              color: "#4b5563",
              fontFamily: "system-ui, sans-serif",
              transform: `translateX(${scrollX}px)`,
            }}
          >
            Pomodorii Main Theme
          </div>
        </div>

        {/* Visualizer bars */}
        <div
          style={{
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
            height: 18,
          }}
        >
          {BAR_HEIGHTS.map((h, i) => {
            const barHeight = interpolate(
              Math.sin(frame * 0.15 + i * 1.5),
              [-1, 1],
              [4, h]
            );
            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height: barHeight,
                  background: "#22d3ee",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
