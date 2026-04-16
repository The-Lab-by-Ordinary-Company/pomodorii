import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SplashScene } from "./scenes/SplashScene";
import { DemoScene } from "./scenes/DemoScene";
import { OutroScene } from "./scenes/OutroScene";

// ─── Sequence timing (total: 750 frames @ 30fps = 25 seconds) ────────────────
//
//   0 –  59  (60 frames, 2.0s)   Splash (fades out last 15 frames)
//  45 – 659  (615 frames, 20.5s) Demo (crossfades in from splash)
// 660 – 749  (90 frames, 3.0s)   Outro

export const PomodoReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <Sequence from={0} durationInFrames={60} name="Splash">
        <SplashScene />
      </Sequence>

      <Sequence from={45} durationInFrames={615} name="Demo">
        <DemoScene />
      </Sequence>

      <Sequence from={660} durationInFrames={90} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
