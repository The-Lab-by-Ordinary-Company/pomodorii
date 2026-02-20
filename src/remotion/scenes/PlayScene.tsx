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

export const PlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button press at frame 15
  const pressSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 8, stiffness: 300 },
  });

  const buttonScale = frame < 15 ? 1 : frame < 20 ? 0.9 : interpolate(pressSpring, [0, 1], [0.9, 1]);

  // Timer countdown (starts after button press)
  const isCountingDown = frame > 20;
  const secondsElapsed = isCountingDown ? Math.floor((frame - 20) / 30) : 0;
  const totalSeconds = 25 * 60 - secondsElapsed;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Orb expansion
  const orbScale = interpolate(frame, [20, 60], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Status badge
  const statusOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ring pulse
  const ringScale = interpolate(frame % 30, [0, 15, 30], [1, 1.15, 1]);
  const ringOpacity = interpolate(frame % 30, [0, 15, 30], [0.4, 0, 0.4]);

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
      <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.4} />

      <CyanOrb scale={orbScale} opacity={0.7} />

      {/* Timer */}
      <span
        style={{
          fontSize: 180,
          fontWeight: 300,
          letterSpacing: -8,
          color: isCountingDown ? "#4b5563" : "#9ca3af",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          zIndex: 10,
        }}
      >
        {timerText}
      </span>

      {/* Play Button */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "white",
          border: isCountingDown ? "none" : "1px solid #e5e7eb",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${buttonScale})`,
        }}
      >
        {/* Pulse ring when active */}
        {isCountingDown && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "4px solid #67e8f9",
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
          />
        )}

        {/* Play/Pause icon */}
        {isCountingDown ? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#22d3ee">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="#d1d5db"
            style={{ marginLeft: 4 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>

      {/* Status badge */}
      {isCountingDown && (
        <div
          style={{
            opacity: statusOpacity,
            padding: "6px 20px",
            borderRadius: 9999,
            background: "rgba(207, 250, 254, 0.5)",
            border: "1px solid #67e8f9",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: "#0891b2",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            zIndex: 10,
          }}
        >
          Focusing...
        </div>
      )}
    </AbsoluteFill>
  );
};
