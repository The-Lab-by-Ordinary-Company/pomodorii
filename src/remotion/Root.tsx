import "./style.css";
import { Composition } from "remotion";
import { PomodoReel } from "./PomodoReel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PomodoReel"
      component={PomodoReel}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
