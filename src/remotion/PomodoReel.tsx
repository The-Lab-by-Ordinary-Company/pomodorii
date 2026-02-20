import { AbsoluteFill, Sequence } from "remotion";
import { SplashScene } from "./scenes/SplashScene";
import { TimerScene } from "./scenes/TimerScene";
import { TasksScene } from "./scenes/TasksScene";
import { PlayScene } from "./scenes/PlayScene";
import { MusicScene } from "./scenes/MusicScene";
import { FinishScene } from "./scenes/FinishScene";
import { FeatureFlashScene } from "./scenes/FeatureFlashScene";

export const PomodoReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90} name="Splash">
        <SplashScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90} name="Timer Appears">
        <TimerScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90} name="Tasks Fly In">
        <TasksScene />
      </Sequence>
      <Sequence from={270} durationInFrames={120} name="Press Play">
        <PlayScene />
      </Sequence>
      <Sequence from={390} durationInFrames={90} name="Music Vibes">
        <MusicScene />
      </Sequence>
      <Sequence from={480} durationInFrames={90} name="Timer Done">
        <FinishScene />
      </Sequence>
      <Sequence from={570} durationInFrames={180} name="Feature Flash">
        <FeatureFlashScene />
      </Sequence>
    </AbsoluteFill>
  );
};
