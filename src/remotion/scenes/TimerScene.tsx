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

const MODES = ["Focus", "Short Break", "Long Break"];

export const TimerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const timerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timerScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 150 },
    from: 0.8,
    to: 1,
  });

  const tabsY = interpolate(frame, [30, 50], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tabsOpacity = interpolate(frame, [30, 50], [0, 1], {
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
        gap: 40,
      }}
    >
      <Audio
        src={staticFile("sound-fx/button-press.wav")}
        volume={0.4}
      />

      <CyanOrb scale={orbScale} opacity={orbScale * 0.6} />

      {/* Mode Tabs */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          transform: `translateY(${tabsY}px)`,
          opacity: tabsOpacity,
        }}
      >
        <WiiPanel
          style={{
            display: "flex",
            gap: 4,
            padding: 6,
            borderRadius: 9999,
          }}
        >
          {MODES.map((mode, i) => (
            <div
              key={mode}
              style={{
                padding: "10px 28px",
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
                color: i === 0 ? "#0e7490" : "#6b7280",
                background:
                  i === 0
                    ? "linear-gradient(180deg, #ecfeff 0%, #cffafe 100%)"
                    : "transparent",
                border: i === 0 ? "1px solid #67e8f9" : "1px solid transparent",
              }}
            >
              {mode}
            </div>
          ))}
        </WiiPanel>
      </div>

      {/* Timer Display */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          opacity: timerOpacity,
          transform: `scale(${Math.max(timerScale, 0.8)})`,
        }}
      >
        <span
          style={{
            fontSize: 180,
            fontWeight: 300,
            letterSpacing: -8,
            color: "#9ca3af",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "system-ui, sans-serif",
            textShadow: "1px 1px 0px rgba(255,255,255,1)",
          }}
        >
          25:00
        </span>
      </div>
    </AbsoluteFill>
  );
};
