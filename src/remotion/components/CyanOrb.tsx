import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const CyanOrb: React.FC<{
  scale?: number;
  opacity?: number;
}> = ({ scale = 1, opacity = 0.8 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.95, 1.05]);

  return (
    <div
      style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(0, 211, 243, 0.4) 0%, rgba(0, 211, 243, 0.1) 50%, transparent 70%)",
        filter: "blur(40px)",
        transform: `scale(${scale * pulse})`,
        opacity,
      }}
    />
  );
};
