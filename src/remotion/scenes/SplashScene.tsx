import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

export const SplashScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
    delay: 5,
  });

  const iconY = interpolate(iconScale, [0, 1], [40, 0]);

  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textX = interpolate(frame, [15, 35], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out in last 15 frames for crossfade into DemoScene
  const fadeOut = interpolate(frame, [45, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Audio src={staticFile("sound-fx/start-chime.wav")} volume={0.4} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            overflow: "hidden",
            transform: `scale(${iconScale}) translateY(${iconY}px)`,
          }}
        >
          <Img
            src={staticFile("pomodorii-icon.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#6b7280",
            opacity: textOpacity,
            transform: `translateX(${textX}px)`,
            fontFamily: "'Wii Sans', system-ui, sans-serif",
          }}
        >
          Pomodorii
        </span>
      </div>
    </AbsoluteFill>
  );
};
