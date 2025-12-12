# 🍅 Pomodorii

A modern, highly-polished Pomodoro timer built for focus and flow. Featuring a custom Web Audio engine, immersive animations, and a Wii-inspired interface.

![Pomodorii Thumbnail](public/Thumbnail.png)

## 🏗️ Tech Stack & Infrastructure

Pomodorii is built on a cutting-edge React stack, leveraging the latest features of Next.js 16 and React 19.

### **Core Stack**
| Category | Technology | Description |
|----------|------------|-------------|
| **Framework** | **Next.js 16** | App Router architecture, Server Components by default. |
| **Library** | **React 19** | Latest React features including Actions and optimized rendering. |
| **Language** | **TypeScript** | Fully typed codebase for strict type safety. |
| **Styling** | **Tailwind CSS 4** | Utility-first CSS with PostCSS. |
| **Animation** | **Framer Motion 12** | Complex layout transitions, drag-and-drop physics, and orchestrations. |
| **Icons** | **Lucide React** | Consistent, lightweight SVG icon set. |
| **State** | **React Hooks** | Extensive use of `useState`, `useEffect`, `useRef` for local state management. |

### **Audio Engine**
*   **Native Web Audio API**: Bypasses standard `<audio>` tags for precision control.
    *   **Context Management**: Global `AudioContext` handling for low-latency playback.
    *   **Seamless Looping**: Custom silence-detection algorithm trims and loops audio buffers byte-perfectly.
    *   **Dynamic Pitch**: Real-time `detune` and `playbackRate` manipulation for randomized SFX variation.
    *   **Volume Control**: Gain nodes for granular volume mixing and mute toggling.

### **Infrastructure Overview**

The application follows the **Next.js App Router** structure, keeping logic co-located with routes.

```ascii
pomodorii/
├── public/                  # Static Assets
│   ├── sound-fx/            # High-fidelity WAV audio files
│   │   ├── main-theme.wav   # Background music
│   │   ├── start-chime.wav  # Splash screen audio
│   │   └── [sfx].wav        # UI interaction sounds
│   └── pomodorii-icon.png   # App branding
│
├── src/
│   └── app/                 # App Router (Source of Truth)
│       ├── globals.css      # Global styles & Tailwind directives
│       ├── layout.tsx       # Root layout: Fonts (Geist), Metadata
│       ├── page.tsx         # CORE APPLICATION LOGIC
│       │   ├── <Timer />    # Countdown logic & browser title updates
│       │   ├── <Tasks />    # Drag-n-drop list with local storage
│       │   ├── <Audio />    # Web Audio API implementation
│       │   └── <UI />       # Settings, Theme Switcher, Visuals
│       └── providers.tsx    # Context Providers (NextThemes)
│
├── tailwind.config.ts       # Design system configuration
├── next.config.ts           # Next.js build configuration
└── package.json             # Dependencies & Scripts
```

## 🧩 Key Architecture Concepts

### 1. **Single-File Logic (Current Phase)**
Currently, the majority of the application logic resides in `src/app/page.tsx` to maintain tight coupling of state during the rapid prototyping phase. This includes:
*   **Timer State**: Managing focus/break cycles and durations.
*   **Audio Ref**: `useRef` hooks holding `AudioContext` and `GainNode` instances.
*   **Task State**: Array of tasks with completion status and sorting order.

### 2. **Client-Side Rendering**
As a highly interactive SPA (Single Page Application) feel, the main page utilizes `"use client"` to leverage browser APIs (Audio, LocalStorage, Window Title).

### 3. **Theming & Preferences**
*   **`next-themes`**: Handles system/light/dark mode switching with hydration mismatch protection.
*   **Local Storage**: Persists user preferences for timer durations, auto-start settings, and task lists.

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project is currently in **Beta (v0.9.0)**.
