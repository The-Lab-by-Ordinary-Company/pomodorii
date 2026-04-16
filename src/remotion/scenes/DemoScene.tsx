import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { AppMockup, type TaskItem, type DragState } from "../components/AppMockup";
import { CyanOrb } from "../components/CyanOrb";
import { getColors } from "../utils/DarkModeColors";
import { type Language } from "../utils/LanguageText";

const FONT = "'Wii Sans', system-ui, sans-serif";

// ─── Camera keyframes ─────────────────────────────────────────────────────────
// Frames:       0    90   180   270   360   430   510   580   614
const CAM_FRAMES = [0, 90, 180, 270, 360, 430, 510, 580, 614];

const CAM_RY =     [0,  -15,  -15,   -5,   15,    10,    -8,     0,     0]; // rotateY
const CAM_RX =     [0,    5,    5,    3,   -3,     2,     8,     0,     0]; // rotateX
const CAM_TZ =     [-800, -100, -100, 200,   0,   100,   150,  -200,  -400]; // translateZ
const CAM_SCALE =  [0.5,  1,    1,   1.3,  1.1,  1.15,   1.2,  0.9,   0.7]; // scale
const CAM_OY =     [50,   50,   50,   30,   50,    40,    70,    50,    50]; // perspectiveOrigin Y%

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const TASKS: TaskItem[] = [
  { id: "1", title: "Write docs", completed: false },
  { id: "2", title: "Design mockups", completed: false },
  { id: "3", title: "Ship it", completed: false },
];

// ─── Cinematic feature text ───────────────────────────────────────────────────
type FeatureText = { text: string; start: number; end: number };

const FEATURE_TEXTS: FeatureText[] = [
  { text: "Your focus companion.", start: 100, end: 170 },
  { text: "Beautiful timer.", start: 190, end: 260 },
  { text: "Light & Dark.", start: 285, end: 355 },
  { text: "4 Languages.", start: 370, end: 425 },
  { text: "Drag & Drop.", start: 445, end: 505 },
  { text: "Focus, beautifully.", start: 520, end: 575 },
];

export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── 3D Camera ────────────────────────────────────────────────────────────
  const rotateY = interpolate(frame, CAM_FRAMES, CAM_RY, CLAMP);
  const rotateX = interpolate(frame, CAM_FRAMES, CAM_RX, CLAMP);
  const translateZ = interpolate(frame, CAM_FRAMES, CAM_TZ, CLAMP);
  const camScale = interpolate(frame, CAM_FRAMES, CAM_SCALE, CLAMP);
  const perspOriginY = interpolate(frame, CAM_FRAMES, CAM_OY, CLAMP);

  // ─── Dark mode (270–355) ─────────────────────────────────────────────────
  const themeProgress = interpolate(
    frame,
    [280, 310, 510, 530],
    [0, 1, 1, 0],
    CLAMP,
  );
  const colors = getColors(themeProgress);

  // Background darkness interpolation
  const bgDarkness = interpolate(
    frame,
    [280, 310, 510, 530],
    [0, 0.6, 0.6, 0],
    CLAMP,
  );

  // ─── Language (360–425) ──────────────────────────────────────────────────
  const language: Language = useMemo(() => {
    if (frame < 370) return "en";
    if (frame < 385) return "ja";
    if (frame < 400) return "es";
    if (frame < 415) return "zh";
    return "en";
  }, [frame]);

  // ─── Drag & Drop (430–509) ──────────────────────────────────────────────
  const dragState: DragState = useMemo(() => {
    if (frame < 445 || frame > 495) {
      return { active: false, taskIndex: 0, offsetY: 0, rotation: 0 };
    }
    const dragY = interpolate(frame, [445, 460, 480, 495], [0, -52, -52, 0], CLAMP);
    const dragRot = interpolate(frame, [445, 455, 485, 495], [0, -1.5, -1.5, 0], CLAMP);
    return { active: true, taskIndex: 0, offsetY: dragY, rotation: dragRot };
  }, [frame]);

  // ─── Fade in / out ───────────────────────────────────────────────────────
  const fadeIn = interpolate(frame, [0, 40], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [585, 614], [1, 0], CLAMP);
  const masterOpacity = fadeIn * fadeOut;

  // ─── Ambient glow ────────────────────────────────────────────────────────
  const orbPulse = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.8, 1.2]);

  // ─── Rim glow intensity ──────────────────────────────────────────────────
  const glowIntensity = interpolate(frame, [0, 60, 580, 614], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(0, 30, 40, ${0.3 + bgDarkness * 0.4}) 0%, #000000 70%)`,
        overflow: "hidden",
      }}
    >
      {/* Ambient cyan glow */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: masterOpacity * 0.4,
        }}
      >
        <CyanOrb scale={orbPulse * 1.5} opacity={0.5} />
      </AbsoluteFill>

      {/* 3D Camera Container */}
      <AbsoluteFill
        style={{
          perspective: 1200,
          perspectiveOrigin: `50% ${perspOriginY}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: masterOpacity,
        }}
      >
        {/* 3D Transform Wrapper */}
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${camScale})`,
            position: "relative",
          }}
        >
          {/* Cyan rim glow behind app */}
          <div
            style={{
              position: "absolute",
              inset: -40,
              borderRadius: 40,
              background: "transparent",
              boxShadow: `0 0 ${60 * glowIntensity}px ${20 * glowIntensity}px rgba(0, 211, 243, ${0.15 * glowIntensity}), 0 0 ${120 * glowIntensity}px ${40 * glowIntensity}px rgba(0, 211, 243, ${0.08 * glowIntensity})`,
              pointerEvents: "none",
            }}
          />

          {/* App panel background (gives the app a "device" feel) */}
          <div
            style={{
              background: colors.bg,
              borderRadius: 32,
              padding: "32px 40px 40px",
              boxShadow: `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, ${0.1 + (1 - themeProgress) * 0.15})`,
              border: `1px solid rgba(255, 255, 255, ${0.08 + (1 - themeProgress) * 0.07})`,
            }}
          >
            <AppMockup
              colors={colors}
              language={language}
              tasks={TASKS}
              timerDisplay="24:42"
              isPlaying={true}
              showCursor={false}
              cursorText=""
              dragState={dragState}
              showMusicPlayer={true}
              musicPlayerProgress={1}
              shellOpacity={1}
            />
          </div>

          {/* Reflection */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              height: 200,
              transform: "scaleY(-1)",
              opacity: 0.06 * glowIntensity,
              overflow: "hidden",
              borderRadius: 32,
              maskImage: "linear-gradient(to top, black 0%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: colors.bg,
                borderRadius: 32,
                padding: "32px 40px 40px",
                filter: "blur(2px)",
              }}
            >
              <AppMockup
                colors={colors}
                language={language}
                tasks={TASKS}
                timerDisplay="24:42"
                isPlaying={true}
                showCursor={false}
                cursorText=""
                dragState={{ active: false, taskIndex: 0, offsetY: 0, rotation: 0 }}
                showMusicPlayer={true}
                musicPlayerProgress={1}
                shellOpacity={1}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Cinematic Feature Text ─────────────────────────────────────────── */}
      {FEATURE_TEXTS.map((ft) => {
        const textIn = spring({
          frame: frame - ft.start,
          fps,
          config: { damping: 16, stiffness: 140 },
        });
        const textOut = interpolate(frame, [ft.end - 15, ft.end], [1, 0], CLAMP);
        const textOpacity = Math.min(textIn, 1) * textOut;
        const textY = interpolate(textIn, [0, 1], [30, 0]);

        if (textOpacity < 0.01) return null;

        return (
          <div
            key={ft.text}
            style={{
              position: "absolute",
              bottom: 80,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 42,
                fontWeight: 600,
                color: "#ffffff",
                fontFamily: FONT,
                letterSpacing: -0.5,
                opacity: textOpacity,
                transform: `translateY(${textY}px)`,
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              {ft.text}
            </span>
          </div>
        );
      })}

      {/* ── Sound Effects ──────────────────────────────────────────────────── */}

      {/* Dark mode toggle */}
      {frame >= 280 && frame < 282 && (
        <Audio src={staticFile("sound-fx/toggle.wav")} volume={0.4} />
      )}

      {/* Language shifts */}
      {frame >= 370 && frame < 372 && (
        <Audio src={staticFile("sound-fx/shift.wav")} volume={0.3} />
      )}
      {frame >= 385 && frame < 387 && (
        <Audio src={staticFile("sound-fx/shift.wav")} volume={0.3} />
      )}
      {frame >= 400 && frame < 402 && (
        <Audio src={staticFile("sound-fx/shift.wav")} volume={0.3} />
      )}
      {frame >= 415 && frame < 417 && (
        <Audio src={staticFile("sound-fx/shift.wav")} volume={0.3} />
      )}

      {/* Drag pickup & drop */}
      {frame >= 445 && frame < 447 && (
        <Audio src={staticFile("sound-fx/task-pickup.wav")} volume={0.4} />
      )}
      {frame >= 495 && frame < 497 && (
        <Audio src={staticFile("sound-fx/task-drop.wav")} volume={0.4} />
      )}
    </AbsoluteFill>
  );
};
