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

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const taglineOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [20, 40], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: contentOpacity * fadeOut,
      }}
    >
      <Audio
        src={staticFile("sound-fx/start-chime.wav")}
        volume={0.25}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            overflow: "hidden",
            transform: `scale(${Math.max(iconScale, 0)})`,
          }}
        >
          <Img
            src={staticFile("pomodorii-icon.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#9AA1AF",
            fontFamily: "'Wii Sans', system-ui, sans-serif",
          }}
        >
          Pomodorii
        </span>
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "#d1d5db",
          letterSpacing: 2,
          fontFamily: "'Wii Sans', system-ui, sans-serif",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Focus, beautifully.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 16,
          fontWeight: 600,
          color: "#d1d5db",
          letterSpacing: 3,
          fontFamily: "'Wii Sans', system-ui, sans-serif",
          opacity: urlOpacity,
        }}
      >
        pomodorii.vercel.app
      </div>
    </AbsoluteFill>
  );
};
