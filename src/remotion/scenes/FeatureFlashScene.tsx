import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { WiiPanel } from "../components/WiiPanel";

const FONT = "'Wii Sans', system-ui, sans-serif";
const LANGUAGES = ["English", "日本語", "Español", "中文"];

export const FeatureFlashScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3 sub-sections: theme (0-39), language (40-79), drag (80-119)
  const section = frame < 40 ? 0 : frame < 80 ? 1 : 2;

  // Section transitions
  const sectionOpacity = (start: number) =>
    interpolate(frame, [start, start + 8, start + 32, start + 40], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Theme toggle
  const isDark = frame > 18 && frame < 40;

  // Language cycling
  const langIndex = Math.min(
    Math.floor((frame - 40) / 10),
    LANGUAGES.length - 1
  );

  // Drag animation
  const dragY = frame >= 80
    ? interpolate(frame - 80, [0, 10, 20, 30], [0, -50, -50, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Sounds */}
      <Audio src={staticFile("sound-fx/toggle.wav")} volume={0.4} />
      {frame >= 40 && frame < 42 && (
        <Audio src={staticFile("sound-fx/shift.wav")} volume={0.3} />
      )}
      {frame >= 80 && frame < 82 && (
        <Audio src={staticFile("sound-fx/task-pickup.wav")} volume={0.4} />
      )}
      {frame >= 100 && frame < 102 && (
        <Audio src={staticFile("sound-fx/task-drop.wav")} volume={0.4} />
      )}

      {/* Section 1: Theme Toggle */}
      {section === 0 && (
        <AbsoluteFill
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 50%, #171717 0%, #000000 100%)"
              : "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            opacity: sectionOpacity(0),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase" as const,
              color: isDark ? "#6b7280" : "#9ca3af",
              fontFamily: FONT,
            }}
          >
            Theme
          </div>
          <WiiPanel style={{ display: "flex", gap: 8, padding: 8, borderRadius: 16 }}>
            {["Light", "Dark", "System"].map((t, i) => (
              <div
                key={t}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: FONT,
                  color:
                    (i === 0 && !isDark) || (i === 1 && isDark)
                      ? "#0891b2"
                      : "#9ca3af",
                  background:
                    (i === 0 && !isDark) || (i === 1 && isDark)
                      ? "rgba(207, 250, 254, 0.5)"
                      : "transparent",
                  border:
                    (i === 0 && !isDark) || (i === 1 && isDark)
                      ? "1px solid #67e8f9"
                      : "1px solid transparent",
                }}
              >
                {t}
              </div>
            ))}
          </WiiPanel>
        </AbsoluteFill>
      )}

      {/* Section 2: Language Switch */}
      {section === 1 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            opacity: sectionOpacity(40),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase" as const,
              color: "#9ca3af",
              fontFamily: FONT,
            }}
          >
            Language
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {LANGUAGES.map((lang, i) => {
              const isActive = i === Math.max(0, langIndex);
              const langSpring = spring({
                frame: frame - 40 - i * 10,
                fps,
                config: { damping: 12, stiffness: 200 },
              });
              return (
                <WiiPanel
                  key={lang}
                  style={{
                    padding: "16px 32px",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: FONT,
                    color: isActive ? "#0891b2" : "#9ca3af",
                    border: isActive ? "1px solid #67e8f9" : undefined,
                    background: isActive ? "rgba(207, 250, 254, 0.5)" : undefined,
                    transform: `scale(${isActive ? Math.max(langSpring, 0.9) : 1})`,
                  }}
                >
                  {lang}
                </WiiPanel>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* Section 3: Drag & Drop */}
      {section === 2 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            opacity: sectionOpacity(80),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase" as const,
              color: "#9ca3af",
              fontFamily: FONT,
            }}
          >
            Drag & Drop
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 420 }}>
            {["Write docs", "Design mockups", "Ship it"].map((task, i) => (
              <WiiPanel
                key={task}
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transform: i === 0 ? `translateY(${dragY}px)` : undefined,
                  boxShadow:
                    i === 0 && frame >= 85 && frame <= 105
                      ? "0 10px 20px rgba(0,0,0,0.1)"
                      : undefined,
                  zIndex: i === 0 ? 10 : 1,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: "0 4px",
                    opacity: 0.3,
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "#6b7280",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2px solid #d1d5db",
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#4b5563",
                    fontFamily: FONT,
                  }}
                >
                  {task}
                </span>
              </WiiPanel>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
