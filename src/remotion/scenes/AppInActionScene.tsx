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
import { CyanOrb } from "../components/CyanOrb";
import { WiiPanel } from "../components/WiiPanel";

const FONT = "'Wii Sans', system-ui, sans-serif";
const MODES = ["Focus", "Short Break", "Long Break"];
const TASKS = ["Design mockups", "Write docs", "Ship it"];

export const AppInActionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Timer appears (0-30)
  const timerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const orbScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const tabsOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Tasks appear (30-60)
  const taskDelays = [30, 40, 50];

  // Phase 3: Play button (60-80)
  const showPlay = frame >= 60;
  const playScale = showPlay
    ? spring({
        frame: frame - 60,
        fps,
        config: { damping: 10, stiffness: 250 },
      })
    : 0;

  const isActive = frame >= 75;
  const buttonPressed = frame >= 70 && frame < 75;

  // Phase 4: Counting down (80-120)
  const secondsElapsed = isActive ? Math.floor((frame - 75) / 8) : 0;
  const totalSeconds = 25 * 60 - secondsElapsed;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerText = isActive
    ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : "25:00";

  const statusOpacity = interpolate(frame, [80, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5: Music player (120-150)
  const showMusic = frame >= 120;
  const musicY = showMusic
    ? spring({
        frame: frame - 120,
        fps,
        config: { damping: 14, stiffness: 120 },
        from: 60,
        to: 0,
      })
    : 60;
  const musicOpacity = interpolate(frame, [120, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6: Finish (150-180)
  const isFinished = frame >= 155;
  const finishTimerText = isFinished ? "00:00" : timerText;
  const flashOpacity = isFinished
    ? interpolate(frame - 155, [0, 4, 12], [0, 0.5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const badgeScale = spring({
    frame: frame - 160,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const checkOpacity = interpolate(frame, [165, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Orb intensity
  const orbIntensity = isActive
    ? interpolate(frame, [75, 100], [0.5, 0.8], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0.5;

  const orbFinalScale = isFinished
    ? 1.4
    : isActive
    ? interpolate(frame, [75, 100], [1, 1.25], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : orbScale;

  // Ring pulse when active
  const ringScale = isActive ? interpolate(frame % 30, [0, 15, 30], [1, 1.12, 1]) : 1;
  const ringOpacity = isActive ? interpolate(frame % 30, [0, 15, 30], [0.3, 0, 0.3]) : 0;

  // Visualizer bars
  const barHeights = [12, 8, 14, 6];

  return (
    <AbsoluteFill
      style={{
        background:
          isFinished
            ? "radial-gradient(circle at 50% 50%, #f0fdf4 0%, #eef2f5 100%)"
            : "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Sounds */}
      <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.35} />
      {frame >= 30 && frame < 32 && (
        <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.25} />
      )}
      {frame >= 40 && frame < 42 && (
        <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.25} />
      )}
      {frame >= 50 && frame < 52 && (
        <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.25} />
      )}
      {frame >= 70 && frame < 72 && (
        <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.4} />
      )}
      {showMusic && (
        <Audio
          src={staticFile("sound-fx/main-theme.wav")}
          volume={(f) =>
            interpolate(f, [0, 15], [0, 0.12], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      )}
      {isFinished && (
        <Audio src={staticFile("sound-fx/alarm.wav")} volume={0.45} />
      )}

      <CyanOrb scale={orbFinalScale} opacity={orbIntensity} />

      {/* Green flash overlay */}
      <AbsoluteFill style={{ background: "#22c55e", opacity: flashOpacity, zIndex: 5 }} />

      {/* Mode Tabs */}
      <div style={{ position: "relative", zIndex: 10, opacity: tabsOpacity }}>
        <WiiPanel style={{ display: "flex", gap: 4, padding: 6, borderRadius: 9999 }}>
          {MODES.map((mode, i) => (
            <div
              key={mode}
              style={{
                padding: "8px 22px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT,
                color: i === 0 ? "#0e7490" : "#6b7280",
                background: i === 0 ? "linear-gradient(180deg, #ecfeff 0%, #cffafe 100%)" : "transparent",
                border: i === 0 ? "1px solid #67e8f9" : "1px solid transparent",
              }}
            >
              {mode}
            </div>
          ))}
        </WiiPanel>
      </div>

      {/* Timer */}
      <div style={{ position: "relative", zIndex: 10, opacity: timerOpacity }}>
        <span
          style={{
            fontSize: 160,
            fontWeight: 300,
            letterSpacing: -6,
            color: isFinished ? "#22c55e" : isActive ? "#4b5563" : "#9ca3af",
            fontVariantNumeric: "tabular-nums",
            fontFamily: FONT,
            textShadow: "1px 1px 0px rgba(255,255,255,1)",
          }}
        >
          {isFinished ? "00:00" : finishTimerText}
        </span>
      </div>

      {/* Play Button + Status Row */}
      {showPlay && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "white",
              border: isActive ? "none" : "1px solid #e5e7eb",
              boxShadow: "0 8px 20px -4px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${buttonPressed ? 0.88 : playScale})`,
              position: "relative",
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: -3,
                  borderRadius: "50%",
                  border: "3px solid #67e8f9",
                  opacity: ringOpacity,
                  transform: `scale(${ringScale})`,
                }}
              />
            )}
            {isActive ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#22d3ee">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#d1d5db" style={{ marginLeft: 2 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Focusing badge */}
          {isActive && !isFinished && (
            <div
              style={{
                opacity: statusOpacity,
                padding: "5px 16px",
                borderRadius: 9999,
                background: "rgba(207, 250, 254, 0.5)",
                border: "1px solid #67e8f9",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase" as const,
                color: "#0891b2",
                fontFamily: FONT,
              }}
            >
              Focusing...
            </div>
          )}

          {/* Finished badge */}
          {isFinished && (
            <div
              style={{
                padding: "5px 16px",
                borderRadius: 9999,
                background: "rgba(220, 252, 231, 0.8)",
                border: "1px solid #86efac",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase" as const,
                color: "#16a34a",
                fontFamily: FONT,
                transform: `scale(${Math.max(badgeScale, 0)})`,
              }}
            >
              Finished!
            </div>
          )}
        </div>
      )}

      {/* Task List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: 380,
          position: "relative",
          zIndex: 10,
        }}
      >
        {TASKS.map((task, i) => {
          const delay = taskDelays[i];
          const taskSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 200 },
          });
          const taskOpacity = interpolate(frame, [delay, delay + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const taskY = interpolate(taskSpring, [0, 1], [-15, 0]);

          const isChecked = isFinished && i === 0;

          return (
            <WiiPanel
              key={task}
              style={{
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: taskOpacity,
                transform: `translateY(${taskY}px)`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: isChecked ? "2px solid #4ade80" : "2px solid #d1d5db",
                  background: isChecked ? "#4ade80" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isChecked ? checkOpacity : 1,
                }}
              >
                {isChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: isChecked ? "#9ca3af" : "#4b5563",
                  textDecoration: isChecked ? "line-through" : "none",
                  fontFamily: FONT,
                }}
              >
                {task}
              </span>
            </WiiPanel>
          );
        })}
      </div>

      {/* Music Player */}
      {showMusic && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "8px 24px",
            borderRadius: 9999,
            background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
            border: "1px solid #d1d5db",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
            opacity: musicOpacity,
            transform: `translateY(${musicY}px)`,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#22d3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div style={{ width: 140, overflow: "hidden" }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#9ca3af",
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                fontFamily: FONT,
                marginBottom: 1,
              }}
            >
              Now Playing
            </div>
            <div
              style={{
                whiteSpace: "nowrap",
                fontSize: 12,
                fontWeight: 500,
                color: "#4b5563",
                fontFamily: FONT,
                transform: `translateX(${interpolate(frame - 120, [0, 60], [140, -200])}px)`,
              }}
            >
              Pomodorii Main Theme
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
            {barHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: interpolate(Math.sin(frame * 0.15 + i * 1.5), [-1, 1], [3, h]),
                  background: "#22d3ee",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
