import React from "react";
import { Img, staticFile } from "remotion";
import { WiiPanel } from "./WiiPanel";
import { type ThemeColors } from "../utils/DarkModeColors";
import { type Language, getTexts } from "../utils/LanguageText";

const FONT = "'Wii Sans', system-ui, sans-serif";

export type TaskItem = {
  id: string;
  title: string;
  completed: boolean;
};

export type DragState = {
  active: boolean;
  taskIndex: number;
  offsetY: number;
  rotation: number;
};

export type AppMockupProps = {
  colors: ThemeColors;
  language: Language;
  tasks: TaskItem[];
  timerDisplay: string;
  isPlaying: boolean;
  showCursor: boolean;
  cursorText: string;
  dragState: DragState;
  showMusicPlayer: boolean;
  musicPlayerProgress: number;
  shellOpacity: number;
  timerPulse?: number;
  completedPulse?: number;
};

export const AppMockup: React.FC<AppMockupProps> = ({
  colors,
  language,
  tasks,
  timerDisplay,
  isPlaying,
  showCursor,
  cursorText,
  dragState,
  showMusicPlayer,
  musicPlayerProgress,
  shellOpacity,
  timerPulse = 0,
  completedPulse = 0,
}) => {
  const t = getTexts(language);

  return (
    <div
      style={{
        width: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        opacity: shellOpacity,
        fontFamily: FONT,
      }}
    >
      {/* Nav Bar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(34,211,238,0.5)",
            }}
          >
            <Img
              src={staticFile("pomodorii-icon.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.textMuted,
              letterSpacing: 0.5,
            }}
          >
            {t.appTitle}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {/* GitHub icon placeholder */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.panelBg,
              border: `1px solid ${colors.panelBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </div>
          {/* Settings icon placeholder */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.panelBg,
              border: `1px solid ${colors.panelBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <WiiPanel
        bg={colors.panelBg}
        borderColor={colors.panelBorder}
        insetColor={colors.panelShadowInset}
        style={{
          display: "flex",
          gap: 0,
          padding: 6,
          borderRadius: 9999,
        }}
      >
        {(["focus", "short", "long"] as const).map((mode, i) => {
          const isActive = i === 0;
          return (
            <div
              key={mode}
              style={{
                position: "relative",
                padding: "8px 24px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 9999,
                color: isActive ? colors.accent : colors.textMuted,
                background: isActive ? colors.accentLight : "transparent",
                border: isActive
                  ? `1px solid ${colors.accentBorder}`
                  : "1px solid transparent",
              }}
            >
              {t.modes[mode]}
            </div>
          );
        })}
      </WiiPanel>

      {/* Timer */}
      <div style={{ textAlign: "center", position: "relative" }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            letterSpacing: -4,
            color: isPlaying ? colors.timerActive : colors.timer,
            lineHeight: 1,
            transform: completedPulse > 0
              ? `scale(${1 + completedPulse * 0.05})`
              : timerPulse > 0
              ? `scale(${1 + timerPulse * 0.02})`
              : "scale(1)",
          }}
        >
          {timerDisplay}
        </div>
        {isPlaying && (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase" as const,
                color: colors.accent,
                padding: "4px 16px",
                borderRadius: 9999,
                background: colors.accentLight,
                border: `1px solid ${colors.accentBorder}`,
              }}
            >
              {t.status}
            </span>
          </div>
        )}
      </div>

      {/* Controls Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Reset */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: colors.panelBg,
            border: `1px solid ${colors.panelBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `inset 0 1px 0 ${colors.panelShadowInset}`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </div>

        {/* Play/Pause */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: colors.panelBg,
            border: `1px solid ${colors.controlBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 10px 25px -5px rgba(0,0,0,0.1), inset 0 2px 0 ${colors.panelShadowInset}`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `4px solid ${isPlaying ? colors.accentBorder : colors.controlBorder}`,
              opacity: isPlaying ? 0.5 : 0,
            }}
          />
          {isPlaying ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill={colors.accent} stroke="none">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill={colors.textFaint} stroke="none" style={{ marginLeft: 3 }}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </div>

        {/* Volume */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: colors.panelBg,
            border: `1px solid ${colors.panelBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `inset 0 1px 0 ${colors.panelShadowInset}`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
      </div>

      {/* Task List */}
      <div style={{ width: "100%", padding: "0 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tasks.map((task, i) => {
            const isDragging = dragState.active && dragState.taskIndex === i;
            const isCompleted = task.completed;

            return (
              <WiiPanel
                key={task.id}
                bg={colors.panelBg}
                borderColor={colors.panelBorder}
                insetColor={colors.panelShadowInset}
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 16,
                  opacity: isCompleted ? 0.6 : 1,
                  transform: isDragging
                    ? `translateY(${dragState.offsetY}px) rotate(${dragState.rotation}deg)`
                    : "translateY(0) rotate(0deg)",
                  boxShadow: isDragging
                    ? "0 12px 24px rgba(0,0,0,0.12)"
                    : undefined,
                  zIndex: isDragging ? 10 : 1,
                  position: "relative" as const,
                }}
              >
                {/* Drag handle dots */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: "0 4px",
                    opacity: isDragging ? 0.6 : 0.3,
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: colors.textMuted,
                      }}
                    />
                  ))}
                </div>

                {/* Checkbox */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: isCompleted
                      ? "2px solid #4ade80"
                      : `2px solid ${colors.checkboxBorder}`,
                    background: isCompleted ? "#4ade80" : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isCompleted && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                {/* Task text */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: isCompleted ? colors.textMuted : colors.text,
                    textDecoration: isCompleted ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
              </WiiPanel>
            );
          })}
        </div>

        {/* Task Input */}
        <WiiPanel
          bg={colors.panelBg}
          borderColor={colors.panelBorder}
          insetColor={colors.panelShadowInset}
          style={{
            marginTop: 12,
            borderRadius: 16,
            overflow: "hidden",
            position: "relative" as const,
          }}
        >
          <div
            style={{
              padding: "14px 24px",
              fontSize: 13,
              color: colors.textMuted,
              textAlign: "center" as const,
              fontWeight: 500,
            }}
          >
            {showCursor ? (
              <span>
                {cursorText}
                <span
                  style={{
                    display: "inline-block",
                    width: 1,
                    height: 14,
                    background: colors.accent,
                    marginLeft: 1,
                    verticalAlign: "middle",
                  }}
                />
              </span>
            ) : (
              t.placeholder
            )}
          </div>
        </WiiPanel>
      </div>

      {/* Music Player Footer */}
      {showMusicPlayer && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 20px",
            borderRadius: 9999,
            background: colors.musicBg,
            border: `1px solid ${colors.musicBorder}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            opacity: musicPlayerProgress,
            transform: `translateY(${(1 - musicPlayerProgress) * 20}px)`,
          }}
        >
          {/* Music icon */}
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase" as const,
                color: colors.textMuted,
              }}
            >
              {t.nowPlaying}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: colors.text,
                maxWidth: 120,
                overflow: "hidden",
                whiteSpace: "nowrap" as const,
              }}
            >
              {t.track}
            </span>
          </div>

          {/* Visualizer bars */}
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
            {[10, 6, 12, 5].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: h * musicPlayerProgress,
                  background: colors.accent,
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
