import { AbsoluteFill, Sequence } from "remotion";
import { SplashScene } from "./scenes/SplashScene";
import { TimerScene } from "./scenes/TimerScene";
import { TasksScene } from "./scenes/TasksScene";

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
    </AbsoluteFill>
  );
};
