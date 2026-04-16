export type Language = "en" | "ja" | "es" | "zh";

type Texts = {
  appTitle: string;
  modes: { focus: string; short: string; long: string };
  status: string;
  placeholder: string;
  nowPlaying: string;
  track: string;
};

const TRANSLATIONS: Record<Language, Texts> = {
  en: {
    appTitle: "Pomodorii",
    modes: { focus: "Focus", short: "Short Break", long: "Long Break" },
    status: "Focusing...",
    placeholder: "Add a new task...",
    nowPlaying: "Now Playing",
    track: "Pomodorii Main Theme",
  },
  ja: {
    appTitle: "ポモドーリ",
    modes: { focus: "集中", short: "小休憩", long: "長休憩" },
    status: "集中中...",
    placeholder: "新しいタスクを追加...",
    nowPlaying: "再生中",
    track: "Pomodorii Radio - Chill Lo-Fi Beats",
  },
  es: {
    appTitle: "Pomodorii",
    modes: { focus: "Enfoque", short: "Descanso Corto", long: "Descanso Largo" },
    status: "Concentrándose...",
    placeholder: "Añadir una nueva tarea...",
    nowPlaying: "Reproduciendo",
    track: "Pomodorii Radio - Chill Lo-Fi Beats",
  },
  zh: {
    appTitle: "Pomodorii",
    modes: { focus: "专注", short: "短休息", long: "长休息" },
    status: "专注中...",
    placeholder: "添加新任务...",
    nowPlaying: "正在播放",
    track: "Pomodorii Radio - Chill Lo-Fi Beats",
  },
};

export function getTexts(lang: Language): Texts {
  return TRANSLATIONS[lang];
}
