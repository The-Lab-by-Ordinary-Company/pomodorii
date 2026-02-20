# Pomodorii Remotion Commercial — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 30-second Remotion video commercial that recreates Pomodorii's Wii-inspired UI with animated scenes, synchronized sound effects, and a playful narrative arc.

**Architecture:** A standalone Remotion project inside `src/remotion/` with its own entry point, sharing the `public/` assets from the main app. Eight scene components orchestrated via `<Sequence>` in a root `<PomodoReel>` composition. Shared UI primitives (`WiiPanel`, `WiiButton`, `CyanOrb`) used across scenes.

**Tech Stack:** Remotion 4 (`remotion`, `@remotion/cli`), React 19, TypeScript 5, inline styles (no Tailwind in Remotion — Remotion bundles separately from Next.js).

---

### Task 1: Install Remotion and scaffold project structure

**Files:**
- Modify: `package.json` (add remotion deps + scripts)
- Create: `src/remotion/index.ts`
- Create: `src/remotion/Root.tsx`
- Create: `src/remotion/PomodoReel.tsx`
- Create: `src/remotion/scenes/` (empty dir)
- Create: `src/remotion/components/` (empty dir)

**Step 1: Install Remotion packages**

Run:
```bash
npm install remotion @remotion/cli @remotion/media
```

**Step 2: Add Remotion scripts to package.json**

Add these scripts alongside the existing ones:
```json
"remotion:studio": "remotion studio src/remotion/index.ts",
"remotion:render": "remotion render src/remotion/index.ts PomodoReel out/pomodorii-commercial.mp4"
```

**Step 3: Create entry point `src/remotion/index.ts`**

```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
```

**Step 4: Create Root composition `src/remotion/Root.tsx`**

```tsx
import { Composition } from "remotion";
import { PomodoReel } from "./PomodoReel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PomodoReel"
      component={PomodoReel}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

**Step 5: Create placeholder orchestrator `src/remotion/PomodoReel.tsx`**

```tsx
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
```

**Step 6: Verify Remotion studio launches**

Run: `npm run remotion:studio`
Expected: Browser opens at localhost:3000 showing Remotion studio with "PomodoReel" composition. Clicking it shows "Pomodorii" text centered on a light gray background.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: scaffold Remotion project structure with PomodoReel composition"
```

---

### Task 2: Build shared UI components (WiiPanel, WiiButton, CyanOrb)

**Files:**
- Create: `src/remotion/components/WiiPanel.tsx`
- Create: `src/remotion/components/WiiButton.tsx`
- Create: `src/remotion/components/CyanOrb.tsx`

**Step 1: Create `src/remotion/components/WiiPanel.tsx`**

```tsx
import React from "react";

export const WiiPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)",
        borderRadius: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
```

**Step 2: Create `src/remotion/components/WiiButton.tsx`**

```tsx
import React from "react";

export const WiiButton: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
}> = ({ children, style, active }) => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)",
        border: active ? "1px solid #38bdf8" : "1px solid #d1d5db",
        boxShadow: active
          ? "0 0 0 4px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)"
          : "0 2px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
        borderRadius: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "#0ea5e9" : "#6b7280",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
```

**Step 3: Create `src/remotion/components/CyanOrb.tsx`**

```tsx
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const CyanOrb: React.FC<{
  scale?: number;
  opacity?: number;
}> = ({ scale = 1, opacity = 0.8 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.95, 1.05]);

  return (
    <div
      style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(0, 211, 243, 0.4) 0%, rgba(0, 211, 243, 0.1) 50%, transparent 70%)",
        filter: "blur(40px)",
        transform: `scale(${scale * pulse})`,
        opacity,
      }}
    />
  );
};
```

**Step 4: Verify by importing CyanOrb into PomodoReel temporarily**

Update `PomodoReel.tsx` to render `<CyanOrb />` behind the text. Run `npm run remotion:studio` and confirm the pulsing orb renders.

**Step 5: Commit**

```bash
git add src/remotion/components/ && git commit -m "feat: add shared WiiPanel, WiiButton, and CyanOrb components"
```

---

### Task 3: Build Scene 1 — SplashScene

**Files:**
- Create: `src/remotion/scenes/SplashScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/SplashScene.tsx`**

```tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

export const SplashScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
    delay: 15,
  });

  const iconY = interpolate(iconScale, [0, 1], [40, 0]);

  const textOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textX = interpolate(frame, [30, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Audio src={staticFile("sound-fx/start-chime.wav")} volume={0.4} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            overflow: "hidden",
            transform: `scale(${iconScale}) translateY(${iconY}px)`,
          }}
        >
          <Img
            src={staticFile("pomodorii-icon.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#9AA1AF",
            opacity: textOpacity,
            transform: `translateX(${textX}px)`,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Pomodorii
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Wire SplashScene into PomodoReel**

Update `src/remotion/PomodoReel.tsx`:

```tsx
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
```

**Step 3: Preview in studio**

Run: `npm run remotion:studio`
Expected: Icon bounces in with spring physics, "Pomodorii" text fades in from the right, start-chime plays.

**Step 4: Commit**

```bash
git add src/remotion/scenes/SplashScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add SplashScene with icon bounce and chime"
```

---

### Task 4: Build Scene 2 — TimerScene

**Files:**
- Create: `src/remotion/scenes/TimerScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/TimerScene.tsx`**

```tsx
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

const MODES = ["Focus", "Short Break", "Long Break"];

export const TimerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const timerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timerScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 150 },
    from: 0.8,
    to: 1,
  });

  const tabsY = interpolate(frame, [30, 50], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tabsOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Audio
        src={staticFile("sound-fx/button-press.wav")}
        volume={0.4}
        startFrom={10}
      />

      <CyanOrb scale={orbScale} opacity={orbScale * 0.6} />

      {/* Mode Tabs */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          transform: `translateY(${tabsY}px)`,
          opacity: tabsOpacity,
        }}
      >
        <WiiPanel
          style={{
            display: "flex",
            gap: 4,
            padding: 6,
            borderRadius: 9999,
          }}
        >
          {MODES.map((mode, i) => (
            <div
              key={mode}
              style={{
                padding: "10px 28px",
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
                color: i === 0 ? "#0e7490" : "#6b7280",
                background:
                  i === 0
                    ? "linear-gradient(180deg, #ecfeff 0%, #cffafe 100%)"
                    : "transparent",
                border: i === 0 ? "1px solid #67e8f9" : "1px solid transparent",
              }}
            >
              {mode}
            </div>
          ))}
        </WiiPanel>
      </div>

      {/* Timer Display */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          opacity: timerOpacity,
          transform: `scale(${Math.max(timerScale, 0.8)})`,
        }}
      >
        <span
          style={{
            fontSize: 180,
            fontWeight: 300,
            letterSpacing: -8,
            color: "#9ca3af",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "system-ui, sans-serif",
            textShadow: "1px 1px 0px rgba(255,255,255,1)",
          }}
        >
          25:00
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Add to PomodoReel**

Add a new `<Sequence>` after the Splash:
```tsx
import { TimerScene } from "./scenes/TimerScene";

// Inside PomodoReel return:
<Sequence from={90} durationInFrames={90} name="Timer Appears">
  <TimerScene />
</Sequence>
```

**Step 3: Preview — confirm orb pulses in, timer fades, tabs slide up**

**Step 4: Commit**

```bash
git add src/remotion/scenes/TimerScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add TimerScene with orb, countdown display, and mode tabs"
```

---

### Task 5: Build Scene 3 — TasksScene

**Files:**
- Create: `src/remotion/scenes/TasksScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/TasksScene.tsx`**

```tsx
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
import { CyanOrb } from "../components/CyanOrb";

const TASKS = ["Design mockups", "Write docs", "Ship it"];
const TASK_DELAYS = [0, 20, 40];

export const TasksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <CyanOrb scale={1} opacity={0.4} />

      {/* Timer static in background */}
      <span
        style={{
          fontSize: 140,
          fontWeight: 300,
          letterSpacing: -6,
          color: "#9ca3af",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          textShadow: "1px 1px 0px rgba(255,255,255,1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        25:00
      </span>

      {/* Task List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 420,
          position: "relative",
          zIndex: 10,
        }}
      >
        {TASKS.map((task, i) => {
          const taskSpring = spring({
            frame: frame - TASK_DELAYS[i],
            fps,
            config: { damping: 14, stiffness: 200 },
          });

          const taskOpacity = interpolate(
            frame,
            [TASK_DELAYS[i], TASK_DELAYS[i] + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const taskY = interpolate(taskSpring, [0, 1], [-20, 0]);
          const taskScale = interpolate(taskSpring, [0, 1], [0.9, 1]);

          return (
            <React.Fragment key={task}>
              {frame >= TASK_DELAYS[i] && (
                <Audio
                  src={staticFile("sound-fx/button-press.wav")}
                  volume={0.3}
                  startFrom={0}
                />
              )}
              <WiiPanel
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: taskOpacity,
                  transform: `translateY(${taskY}px) scale(${taskScale})`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2px solid #d1d5db",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#4b5563",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {task}
                </span>
              </WiiPanel>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Add to PomodoReel**

```tsx
import { TasksScene } from "./scenes/TasksScene";

<Sequence from={180} durationInFrames={90} name="Tasks Fly In">
  <TasksScene />
</Sequence>
```

**Step 3: Preview — three tasks pop in with staggered spring animations**

**Step 4: Commit**

```bash
git add src/remotion/scenes/TasksScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add TasksScene with staggered task entry animations"
```

---

### Task 6: Build Scene 4 — PlayScene

**Files:**
- Create: `src/remotion/scenes/PlayScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/PlayScene.tsx`**

```tsx
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

export const PlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button press at frame 15
  const pressSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 8, stiffness: 300 },
  });

  const buttonScale = frame < 15 ? 1 : frame < 20 ? 0.9 : interpolate(pressSpring, [0, 1], [0.9, 1]);

  // Timer countdown (starts after button press)
  const isCountingDown = frame > 20;
  const secondsElapsed = isCountingDown ? Math.floor((frame - 20) / 30) : 0;
  const totalSeconds = 25 * 60 - secondsElapsed;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Orb expansion
  const orbScale = interpolate(frame, [20, 60], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Status badge
  const statusOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ring pulse
  const ringScale = interpolate(frame % 30, [0, 15, 30], [1, 1.15, 1]);
  const ringOpacity = interpolate(frame % 30, [0, 15, 30], [0.4, 0, 0.4]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Audio src={staticFile("sound-fx/button-press.wav")} volume={0.4} startFrom={15} />

      <CyanOrb scale={orbScale} opacity={0.7} />

      {/* Timer */}
      <span
        style={{
          fontSize: 180,
          fontWeight: 300,
          letterSpacing: -8,
          color: isCountingDown ? "#4b5563" : "#9ca3af",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          zIndex: 10,
          transition: "color 0.3s",
        }}
      >
        {timerText}
      </span>

      {/* Play Button */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "white",
          border: isCountingDown ? "none" : "1px solid #e5e7eb",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${buttonScale})`,
        }}
      >
        {/* Pulse ring when active */}
        {isCountingDown && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "4px solid #67e8f9",
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
          />
        )}

        {/* Play/Pause icon */}
        {isCountingDown ? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#22d3ee">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="#d1d5db"
            style={{ marginLeft: 4 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>

      {/* Status badge */}
      {isCountingDown && (
        <div
          style={{
            opacity: statusOpacity,
            padding: "6px 20px",
            borderRadius: 9999,
            background: "rgba(207, 250, 254, 0.5)",
            border: "1px solid #67e8f9",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#0891b2",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            zIndex: 10,
          }}
        >
          Focusing...
        </div>
      )}
    </AbsoluteFill>
  );
};
```

**Step 2: Add to PomodoReel**

```tsx
import { PlayScene } from "./scenes/PlayScene";

<Sequence from={270} durationInFrames={120} name="Press Play">
  <PlayScene />
</Sequence>
```

**Step 3: Preview — button presses, timer starts counting, orb expands**

**Step 4: Commit**

```bash
git add src/remotion/scenes/PlayScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add PlayScene with button press and countdown animation"
```

---

### Task 7: Build Scene 5 — MusicScene

**Files:**
- Create: `src/remotion/scenes/MusicScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/MusicScene.tsx`**

```tsx
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

const BAR_HEIGHTS = [12, 8, 14, 6];

export const MusicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timer still running in background
  const secondsElapsed = Math.floor(frame / 30) + 5;
  const totalSeconds = 25 * 60 - secondsElapsed;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Player slides up
  const playerY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
    from: 100,
    to: 0,
  });

  const playerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scrolling text
  const scrollX = interpolate(frame, [0, 90], [200, -250]);

  // Music volume fade in
  const musicVolume = interpolate(frame, [0, 20], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Audio
        src={staticFile("sound-fx/main-theme.wav")}
        volume={(f) =>
          interpolate(f, [0, 20], [0, 0.15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      <CyanOrb scale={1.3} opacity={0.7} />

      {/* Timer still visible */}
      <span
        style={{
          fontSize: 140,
          fontWeight: 300,
          letterSpacing: -6,
          color: "#4b5563",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          zIndex: 10,
        }}
      >
        {timerText}
      </span>

      {/* Music Player Bar */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "10px 28px",
          borderRadius: 9999,
          background:
            "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          border: "1px solid #d1d5db",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
          opacity: playerOpacity,
          transform: `translateY(${playerY}px)`,
        }}
      >
        {/* Music icon */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#22d3ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>

        {/* Text area */}
        <div style={{ width: 160, overflow: "hidden" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: 2,
              fontFamily: "system-ui, sans-serif",
              marginBottom: 2,
            }}
          >
            Now Playing
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              fontSize: 13,
              fontWeight: 500,
              color: "#4b5563",
              fontFamily: "system-ui, sans-serif",
              transform: `translateX(${scrollX}px)`,
            }}
          >
            Pomodorii Main Theme
          </div>
        </div>

        {/* Visualizer bars */}
        <div
          style={{
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
            height: 18,
          }}
        >
          {BAR_HEIGHTS.map((h, i) => {
            const barHeight = interpolate(
              Math.sin(frame * 0.15 + i * 1.5),
              [-1, 1],
              [4, h]
            );
            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height: barHeight,
                  background: "#22d3ee",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Add to PomodoReel**

```tsx
import { MusicScene } from "./scenes/MusicScene";

<Sequence from={390} durationInFrames={90} name="Music Vibes">
  <MusicScene />
</Sequence>
```

**Step 3: Preview — player slides up, visualizer bars bounce, "Now Playing" scrolls, music fades in**

**Step 4: Commit**

```bash
git add src/remotion/scenes/MusicScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add MusicScene with player bar, visualizer, and main theme"
```

---

### Task 8: Build Scene 6 — FinishScene

**Files:**
- Create: `src/remotion/scenes/FinishScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/FinishScene.tsx`**

```tsx
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

export const FinishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timer counts down to 00:00
  const countdownSeconds = Math.max(0, 5 - Math.floor(frame / 6));
  const timerText =
    countdownSeconds > 0
      ? `00:${String(countdownSeconds).padStart(2, "0")}`
      : "00:00";

  const isFinished = countdownSeconds === 0;

  // Flash effect
  const flashOpacity = isFinished
    ? interpolate(frame - 30, [0, 5, 15], [0, 0.6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Badge spring
  const badgeScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Task checkmark
  const checkOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #ffffff 0%, #eef2f5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <Audio src={staticFile("sound-fx/alarm.wav")} volume={0.5} startFrom={30} />

      <CyanOrb scale={1.3} opacity={isFinished ? 0.9 : 0.7} />

      {/* Green flash */}
      <AbsoluteFill
        style={{
          background: "#22c55e",
          opacity: flashOpacity,
          zIndex: 5,
        }}
      />

      {/* Timer */}
      <span
        style={{
          fontSize: 180,
          fontWeight: 300,
          letterSpacing: -8,
          color: isFinished ? "#22c55e" : "#4b5563",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          zIndex: 10,
        }}
      >
        {timerText}
      </span>

      {/* Finished badge */}
      {isFinished && (
        <div
          style={{
            padding: "8px 24px",
            borderRadius: 9999,
            background: "rgba(220, 252, 231, 0.8)",
            border: "1px solid #86efac",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#16a34a",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            zIndex: 10,
            transform: `scale(${Math.max(badgeScale, 0)})`,
          }}
        >
          Finished!
        </div>
      )}

      {/* Task auto-complete */}
      {isFinished && (
        <WiiPanel
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            width: 420,
            position: "relative",
            zIndex: 10,
            opacity: checkOpacity,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#4ade80",
              border: "2px solid #4ade80",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#9ca3af",
              textDecoration: "line-through",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Design mockups
          </span>
        </WiiPanel>
      )}
    </AbsoluteFill>
  );
};
```

**Step 2: Add to PomodoReel**

```tsx
import { FinishScene } from "./scenes/FinishScene";

<Sequence from={480} durationInFrames={90} name="Timer Done">
  <FinishScene />
</Sequence>
```

**Step 3: Preview — timer counts to zero, green flash, "Finished!" badge bounces in, task gets checked**

**Step 4: Commit**

```bash
git add src/remotion/scenes/FinishScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add FinishScene with countdown, green flash, and task completion"
```

---

### Task 9: Build Scene 7 — FeatureFlashScene

**Files:**
- Create: `src/remotion/scenes/FeatureFlashScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/FeatureFlashScene.tsx`**

```tsx
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

const LANGUAGES = ["English", "日本語", "Español", "中文"];

export const FeatureFlashScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3 sub-sections: theme (0-59), language (60-119), drag (120-179)
  const section = frame < 60 ? 0 : frame < 120 ? 1 : 2;

  // Section transitions
  const sectionOpacity = (start: number) =>
    interpolate(frame, [start, start + 10, start + 50, start + 60], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Theme toggle
  const isDark = frame > 25 && frame < 60;
  const themeTransition = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Language cycling
  const langIndex = Math.min(
    Math.floor((frame - 60) / 15),
    LANGUAGES.length - 1
  );

  // Drag animation
  const dragY = frame >= 120
    ? interpolate(frame - 120, [0, 15, 30, 45], [0, -50, -50, 0], {
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
      <Audio src={staticFile("sound-fx/toggle.wav")} volume={0.4} startFrom={20} />
      <Audio src={staticFile("sound-fx/shift.wav")} volume={0.3} startFrom={60} />
      <Audio src={staticFile("sound-fx/task-pickup.wav")} volume={0.4} startFrom={120} />
      <Audio src={staticFile("sound-fx/task-drop.wav")} volume={0.4} startFrom={150} />

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
          {/* Feature label */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: isDark ? "#6b7280" : "#9ca3af",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Theme
          </div>

          {/* Theme buttons */}
          <WiiPanel style={{ display: "flex", gap: 8, padding: 8, borderRadius: 16 }}>
            {["Light", "Dark", "System"].map((t, i) => (
              <div
                key={t}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "system-ui, sans-serif",
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
            opacity: sectionOpacity(60),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Language
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {LANGUAGES.map((lang, i) => {
              const isActive = i === Math.max(0, langIndex);
              const langSpring = spring({
                frame: frame - 60 - i * 15,
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
                    fontFamily: "system-ui, sans-serif",
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
            opacity: sectionOpacity(120),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
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
                    i === 0 && frame >= 125 && frame <= 145
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
                    fontFamily: "system-ui, sans-serif",
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
```

**Step 2: Add to PomodoReel**

```tsx
import { FeatureFlashScene } from "./scenes/FeatureFlashScene";

<Sequence from={570} durationInFrames={180} name="Feature Flash">
  <FeatureFlashScene />
</Sequence>
```

**Step 3: Preview — theme toggles light/dark, languages cycle, task drags up and back**

**Step 4: Commit**

```bash
git add src/remotion/scenes/FeatureFlashScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add FeatureFlashScene with theme, language, and drag montage"
```

---

### Task 10: Build Scene 8 — OutroScene

**Files:**
- Create: `src/remotion/scenes/OutroScene.tsx`
- Modify: `src/remotion/PomodoReel.tsx`

**Step 1: Create `src/remotion/scenes/OutroScene.tsx`**

```tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from white
  const contentOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const taglineOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [40, 65], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade out
  const fadeOut = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: contentOpacity * fadeOut,
      }}
    >
      <Audio
        src={staticFile("sound-fx/start-chime.wav")}
        volume={0.25}
        startFrom={10}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            overflow: "hidden",
            transform: `scale(${Math.max(iconScale, 0)})`,
          }}
        >
          <Img
            src={staticFile("pomodorii-icon.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#9AA1AF",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Pomodorii
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "#d1d5db",
          letterSpacing: 2,
          fontFamily: "system-ui, sans-serif",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Focus, beautifully.
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 16,
          fontWeight: 600,
          color: "#d1d5db",
          letterSpacing: 3,
          fontFamily: "system-ui, sans-serif",
          opacity: urlOpacity,
        }}
      >
        pomodorii.vercel.app
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Add to PomodoReel (final assembly)**

Update `src/remotion/PomodoReel.tsx` with all scenes:

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { SplashScene } from "./scenes/SplashScene";
import { TimerScene } from "./scenes/TimerScene";
import { TasksScene } from "./scenes/TasksScene";
import { PlayScene } from "./scenes/PlayScene";
import { MusicScene } from "./scenes/MusicScene";
import { FinishScene } from "./scenes/FinishScene";
import { FeatureFlashScene } from "./scenes/FeatureFlashScene";
import { OutroScene } from "./scenes/OutroScene";

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
      <Sequence from={750} durationInFrames={150} name="Logo Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Step 3: Preview full video end-to-end in Remotion studio**

Run: `npm run remotion:studio`
Scrub through all 900 frames. Verify each scene transitions cleanly and sounds play at the right times.

**Step 4: Commit**

```bash
git add src/remotion/scenes/OutroScene.tsx src/remotion/PomodoReel.tsx && git commit -m "feat: add OutroScene and assemble all 8 scenes into PomodoReel"
```

---

### Task 11: Polish transitions and render final video

**Files:**
- Modify: `src/remotion/PomodoReel.tsx` (add cross-fade transitions if needed)

**Step 1: Test full render**

Run:
```bash
npm run remotion:render
```
Expected: Outputs `out/pomodorii-commercial.mp4` — a 30-second 1920x1080 MP4 video.

**Step 2: Add `out/` to `.gitignore`**

Append `out/` to `.gitignore` if not already present.

**Step 3: Final commit**

```bash
git add -A && git commit -m "feat: complete Pomodorii Remotion commercial — ready to render"
```
