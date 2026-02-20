import { AbsoluteFill } from "remotion";

export const PomodoReel: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#eef2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 80, color: "#9ca3af" }}>Pomodorii</h1>
    </AbsoluteFill>
  );
};
