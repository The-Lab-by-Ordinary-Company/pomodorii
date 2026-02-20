import { AbsoluteFill, Sequence } from "remotion";
import { SplashScene } from "./scenes/SplashScene";

export const PomodoReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90} name="Splash">
        <SplashScene />
      </Sequence>
    </AbsoluteFill>
  );
};
