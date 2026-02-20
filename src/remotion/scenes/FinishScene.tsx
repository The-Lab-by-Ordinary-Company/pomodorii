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
import { WiiPanel } from "../components/WiiPanel";

export const FinishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timer counts down to 00:00
  const countdownSeconds = Math.max(0, 5 - Math.floor(frame / 6));
  const timerText =
    countdownSeconds > 0
      ? `00:${String(countdownSeconds).padStart(2, "0")}`
      : "00:00";

  const isFinished = countdownSeconds === 0;

  // Flash effect
  const flashOpacity = isFinished
    ? interpolate(frame - 30, [0, 5, 15], [0, 0.6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Badge spring
  const badgeScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Task checkmark
  const checkOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      <Audio src={staticFile("sound-fx/alarm.wav")} volume={0.5} />

      <CyanOrb scale={1.3} opacity={isFinished ? 0.9 : 0.7} />

      {/* Green flash */}
      <AbsoluteFill
        style={{
          background: "#22c55e",
          opacity: flashOpacity,
          zIndex: 5,
        }}
      />

      {/* Timer */}
      <span
        style={{
          fontSize: 180,
          fontWeight: 300,
          letterSpacing: -8,
          color: isFinished ? "#22c55e" : "#4b5563",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          zIndex: 10,
        }}
      >
        {timerText}
      </span>

      {/* Finished badge */}
      {isFinished && (
        <div
          style={{
            padding: "8px 24px",
            borderRadius: 9999,
            background: "rgba(220, 252, 231, 0.8)",
            border: "1px solid #86efac",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: "#16a34a",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            zIndex: 10,
            transform: `scale(${Math.max(badgeScale, 0)})`,
          }}
        >
          Finished!
        </div>
      )}

      {/* Task auto-complete */}
      {isFinished && (
        <WiiPanel
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            width: 420,
            position: "relative",
            zIndex: 10,
            opacity: checkOpacity,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#4ade80",
              border: "2px solid #4ade80",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#9ca3af",
              textDecoration: "line-through",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Design mockups
          </span>
        </WiiPanel>
      )}
    </AbsoluteFill>
  );
};
