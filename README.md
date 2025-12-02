<p align="center">
  <img src="public/pomodorii-icon.png" alt="Pomodorii" width="80" />
</p>

<p align="center">
  <strong>A delightful pomodoro timer with a retro-console aesthetic.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
</p>

---

## About

Pomodorii is a pomodoro timer built with a Wii-inspired glassy UI. It features custom sound effects, a built-in ambient music player powered by the Web Audio API, drag-and-drop task management, and multi-language support.

![Pomodorii Thumbnail](public/Thumbnail.png)

## Features

- **Pomodoro timer** with configurable focus, short break, and long break durations
- **Task list** with drag-and-drop reordering, auto-complete on pomodoro finish, and completed-to-bottom sorting
- **Built-in music player** using the Web Audio API with seamless looping and volume control
- **Custom sound effects** for every interaction (button presses, toggles, alarms, task drag/drop)
- **Theme switching** between light, dark, and system preference
- **4 languages** — English, Japanese, Spanish, and Chinese
- **Reduce Motion** accessibility option that disables all animations
- **Keyboard shortcuts** — spacebar to play/pause the timer

## Architecture

```
src/app/
├── layout.tsx        Root layout (Geist font, metadata, providers)
├── globals.css       Wii-style component classes and animations
├── providers.tsx     Theme provider (next-themes)
└── page.tsx          Single-file application (timer, tasks, audio, settings)

public/
├── sound-fx/         WAV audio files (theme song, UI sounds)
├── pomodorii-icon.png
└── Thumbnail.png
```

The entire application lives in a single `page.tsx` file as a client component. State is managed locally with React hooks. Audio playback uses the native Web Audio API (`AudioContext`, `GainNode`, `AudioBufferSourceNode`) rather than HTML `<audio>` elements for precise control over looping, volume, and playback.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Theming:** next-themes
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>&copy; 2026 Ordinary Company Group LLC. All rights reserved.</sub>
</p>
