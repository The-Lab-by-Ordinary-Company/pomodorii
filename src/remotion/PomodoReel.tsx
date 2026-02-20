import { AbsoluteFill, Sequence } from "remotion";
import { SplashScene } from "./scenes/SplashScene";
import { AppInActionScene } from "./scenes/AppInActionScene";
import { FeatureFlashScene } from "./scenes/FeatureFlashScene";
import { OutroScene } from "./scenes/OutroScene";

export const PomodoReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Splash">
        <SplashScene />
      </Sequence>
      <Sequence from={60} durationInFrames={180} name="App in Action">
        <AppInActionScene />
      </Sequence>
      <Sequence from={240} durationInFrames={120} name="Feature Highlights">
        <FeatureFlashScene />
      </Sequence>
      <Sequence from={360} durationInFrames={90} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
