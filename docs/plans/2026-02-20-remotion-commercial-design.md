# Pomodorii Remotion Commercial — Design Document

**Date**: 2026-02-20
**Concept**: "A Day with Pomodorii"
**Format**: 30 seconds, 1920x1080, 30fps (900 frames)
**Style**: Native React recreation of Pomodorii's Wii-inspired glassy UI

## Overview

A 30-second commercial that follows a complete focus session from launch to completion. Every beat syncs with Pomodorii's real sound effects. The viewer experiences the core product loop — splash, set tasks, focus, listen to music, finish, explore features — in a story-driven, playful format.

## Scene Breakdown

| # | Scene | Frames | Duration | Sound | Description |
|---|-------|--------|----------|-------|-------------|
| 1 | Splash | 0–89 | ~3s | `start-chime.wav` | White screen. Icon bounces in, "Pomodorii" fades in beside it. Matches the real splash screen. |
| 2 | Timer Appears | 90–179 | ~3s | `button-press.wav` | Cyan orb pulses into view behind "25:00". Mode tabs (Focus / Short / Long) slide in. |
| 3 | Tasks Fly In | 180–269 | ~3s | `button-press.wav` x3 | Three tasks type in and pop into the list: "Design mockups", "Write docs", "Ship it". |
| 4 | Press Play | 270–389 | ~4s | `button-press.wav` | Play button press animation. Timer counts down (25:00 -> 24:55…). Orb expands. Status: "Focusing…" |
| 5 | Music Vibes | 390–479 | ~3s | Main theme fades in | Music player bar slides up. Visualizer bars bounce. "Now Playing" text scrolls. |
| 6 | Timer Done | 480–569 | ~3s | `alarm.wav` | Timer hits 00:00. Flash green. "Finished!" badge. First task auto-completes. |
| 7 | Feature Flash | 570–749 | ~6s | `toggle.wav`, `shift.wav`, `task-pickup.wav`, `task-drop.wav` | Quick montage: theme toggle (light->dark), language cycle (EN->JA->ES->ZH), task drag-and-drop. |
| 8 | Logo Outro | 750–899 | ~5s | `start-chime.wav` (soft) | Fade to white. Icon + "Pomodorii" centered. Tagline "Focus, beautifully." URL at bottom. |

## Components

### Scene Components
1. `<PomodoReel>` — Root Remotion Composition, orchestrates scenes via `<Sequence>`
2. `<SplashScene>` — Logo + icon animation
3. `<TimerScene>` — Orb background + timer display + mode tabs
4. `<TasksScene>` — Task list with staggered entry animations
5. `<PlayScene>` — Play button press + countdown
6. `<MusicScene>` — Music player bar + visualizer
7. `<FinishScene>` — Timer completion + celebration
8. `<FeatureFlashScene>` — Theme/language/drag montage
9. `<OutroScene>` — Logo + tagline fade-out

### Shared UI Components
- `<WiiPanel>` — Glassy panel matching `.wii-panel` CSS
- `<WiiButton>` — Button matching `.wii-btn` CSS
- `<CyanOrb>` — Animated background orb

## Sound Design

All sounds via Remotion's `<Audio>` with precise frame offsets. Main theme fades in during scene 5, persists softly through 6-7, fades out in 8.

## Color Palette

- Primary cyan: `#00D3F3`
- Accent cyan: `#38bdf8`
- Background: `#eef2f5` (light), `#000000` (dark)
- Panel: `rgba(255, 255, 255, 0.85)` with `backdrop-blur`
- Text: `#4b5563` (body), `#9ca3af` (timer)
- Success green: `#22c55e`

## Tech Stack

- `remotion` + `@remotion/cli` — composition and rendering
- `@remotion/tailwind` — styling reuse
- React with `useCurrentFrame()`, `interpolate()`, `spring()` for animations
- Sound effects from `public/sound-fx/`

## File Structure

```
src/remotion/
├── index.ts              # registerRoot
├── Root.tsx              # <Composition> definitions
├── PomodoReel.tsx        # Main composition orchestrator
├── scenes/
│   ├── SplashScene.tsx
│   ├── TimerScene.tsx
│   ├── TasksScene.tsx
│   ├── PlayScene.tsx
│   ├── MusicScene.tsx
│   ├── FinishScene.tsx
│   ├── FeatureFlashScene.tsx
│   └── OutroScene.tsx
└── components/
    ├── WiiPanel.tsx
    ├── WiiButton.tsx
    └── CyanOrb.tsx
```
