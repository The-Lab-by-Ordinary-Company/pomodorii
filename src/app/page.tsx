"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings2,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Clock,
  List,
  Monitor,
  Sun,
  Moon,
  Globe,
  Check,
  Zap,
  Trash2,
  Github,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, Reorder, useDragControls, MotionConfig } from "framer-motion";
import Image from "next/image";
import { ChannelCard } from "@/components/radio/ChannelCard";
import { LocalChannelPanel } from "@/components/radio/LocalChannelPanel";
import { RadioDrawer } from "@/components/radio/RadioDrawer";
import { RadioPill } from "@/components/radio/RadioPill";
import { YouTubeChannelPanel } from "@/components/radio/YouTubeChannelPanel";
import { RADIO_CHANNELS, getRadioChannel } from "@/lib/radio/channels";
import type { RadioChannelId, RadioPlaybackState } from "@/lib/radio/types";
import packageJson from "../../package.json";

type Language = "en" | "ja" | "es" | "zh";

const TRANSLATIONS = {
  en: {
    appTitle: "Pomodorii",
    status: {
      ready: "Ready",
      finished: "Finished!",
      paused: "Paused",
      focusing: "Focusing...",
      break: "Break Time",
    },
    modes: {
      focus: "Focus",
      short: "Short Break",
      long: "Long Break",
    },
    settings: {
      title: "Settings",
      timer: "Timer Settings",
      pomodoro: "Pomodoro",
      shortBreak: "Short Break",
      longBreak: "Long Break",
      autoStartBreaks: "Auto Start Breaks",
      autoStartPomodoros: "Auto Start Pomodoros",
      longBreakInterval: "Long Break Interval",
      task: "Task Settings",
      autoCheck: "Auto Check Tasks",
      checkToBottom: "Check to Bottom",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      language: "Language",
      accessibility: "Accessibility",
      reduceMotion: "Reduce Motion",
      reduceMotionDesc: "Disable background animations",
      credits: {
        dev: "Designed and Developed by Charles J. (CJ) Dyas",
        version: `v${packageJson.version}`,
      },
    },
    tasks: {
      placeholder: "Add a new task...",
    },
    radio: {
      title: "Pomodorii Radio",
      subtitle: "Choose a channel",
      states: {
        idle: "Idle",
        ready: "Ready",
        playing: "Playing",
      },
      local: {
        title: "Pomodorii App Channel",
        ready: "Ready to play the built-in theme.",
        playing: "Playing through the built-in Web Audio channel.",
        togglePlay: "Toggle Pomodorii App Channel playback",
        volume: "Local channel volume",
      },
      youtube: {
        attribution: "Source:",
        clickToStart: "Click play inside the player to start from the beginning.",
        openOnYoutube: "Open on YouTube",
        loadError: "The YouTube embed could not be loaded here. Open the original video instead.",
      },
    },
  },
  ja: {
    appTitle: "ポモドーリ",
    status: {
      ready: "準備完了",
      finished: "完了！",
      paused: "一時停止",
      focusing: "集中中...",
      break: "休憩時間",
    },
    modes: {
      focus: "集中",
      short: "小休憩",
      long: "長休憩",
    },
    settings: {
      title: "設定",
      timer: "タイマー設定",
      pomodoro: "ポモドーロ",
      shortBreak: "小休憩",
      longBreak: "長休憩",
      autoStartBreaks: "休憩を自動開始",
      autoStartPomodoros: "ポモドーロを自動開始",
      longBreakInterval: "長休憩の間隔",
      task: "タスク設定",
      autoCheck: "タスクを自動完了",
      checkToBottom: "完了を下に移動",
      theme: "テーマ",
      light: "ライト",
      dark: "ダーク",
      system: "システム",
      language: "言語",
      accessibility: "アクセシビリティ",
      reduceMotion: "視差効果を減らす",
      reduceMotionDesc: "背景アニメーションを無効化",
      credits: {
        dev: "デザイン・開発: Charles J. (CJ) Dyas",
        version: `v${packageJson.version}`,
      },
    },
    tasks: {
      placeholder: "新しいタスクを追加...",
    },
    radio: {
      title: "Pomodorii Radio",
      subtitle: "チャンネルを選択",
      states: {
        idle: "待機中",
        ready: "準備完了",
        playing: "再生中",
      },
      local: {
        title: "Pomodorii App Channel",
        ready: "内蔵テーマを再生できます。",
        playing: "内蔵のWeb Audioチャンネルで再生中。",
        togglePlay: "Pomodorii App Channelの再生を切り替え",
        volume: "ローカルチャンネルの音量",
      },
      youtube: {
        attribution: "ソース:",
        clickToStart: "プレーヤー内の再生ボタンで最初から開始します。",
        openOnYoutube: "YouTubeで開く",
        loadError: "ここではYouTube埋め込みを読み込めませんでした。元の動画を開いてください。",
      },
    },
  },
  es: {
    appTitle: "Pomodorii",
    status: {
      ready: "Listo",
      finished: "¡Terminado!",
      paused: "Pausado",
      focusing: "Concentrándose...",
      break: "Tiempo de descanso",
    },
    modes: {
      focus: "Enfoque",
      short: "Descanso Corto",
      long: "Descanso Largo",
    },
    settings: {
      title: "Configuración",
      timer: "Configuración del Temporizador",
      pomodoro: "Pomodoro",
      shortBreak: "Descanso Corto",
      longBreak: "Descanso Largo",
      autoStartBreaks: "Iniciar Descansos Auto.",
      autoStartPomodoros: "Iniciar Pomodoros Auto.",
      longBreakInterval: "Intervalo de Descanso Largo",
      task: "Configuración de Tareas",
      autoCheck: "Auto-completar Tareas",
      checkToBottom: "Mover Completadas al Fondo",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
      language: "Idioma",
      accessibility: "Accesibilidad",
      reduceMotion: "Reducir Movimiento",
      reduceMotionDesc: "Desactivar animaciones de fondo",
      credits: {
        dev: "Diseñado y Desarrollado por Charles J. (CJ) Dyas",
        version: `v${packageJson.version}`,
      },
    },
    tasks: {
      placeholder: "Añadir una nueva tarea...",
    },
    radio: {
      title: "Pomodorii Radio",
      subtitle: "Elige un canal",
      states: {
        idle: "Inactivo",
        ready: "Listo",
        playing: "Reproduciendo",
      },
      local: {
        title: "Pomodorii App Channel",
        ready: "Listo para reproducir el tema integrado.",
        playing: "Reproduciendo desde el canal integrado de Web Audio.",
        togglePlay: "Alternar reproducción de Pomodorii App Channel",
        volume: "Volumen del canal local",
      },
      youtube: {
        attribution: "Fuente:",
        clickToStart: "Pulsa reproducir dentro del reproductor para empezar desde el principio.",
        openOnYoutube: "Abrir en YouTube",
        loadError: "No se pudo cargar el embed de YouTube aquí. Abre el video original.",
      },
    },
  },
  zh: {
    appTitle: "Pomodorii",
    status: {
      ready: "准备就绪",
      finished: "已完成！",
      paused: "已暂停",
      focusing: "专注中...",
      break: "休息时间",
    },
    modes: {
      focus: "专注",
      short: "短休息",
      long: "长休息",
    },
    settings: {
      title: "设置",
      timer: "计时器设置",
      pomodoro: "番茄钟",
      shortBreak: "短休息",
      longBreak: "长休息",
      autoStartBreaks: "自动开始休息",
      autoStartPomodoros: "自动开始番茄钟",
      longBreakInterval: "长休息间隔",
      task: "任务设置",
      autoCheck: "自动勾选任务",
      checkToBottom: "勾选后移至底部",
      theme: "主题",
      light: "浅色",
      dark: "深色",
      system: "系统",
      language: "语言",
      accessibility: "辅助功能",
      reduceMotion: "减少动态效果",
      reduceMotionDesc: "禁用背景动画",
      credits: {
        dev: "设计与开发: Charles J. (CJ) Dyas",
        version: `v${packageJson.version}`,
      },
    },
    tasks: {
      placeholder: "添加新任务...",
    },
    radio: {
      title: "Pomodorii Radio",
      subtitle: "选择一个频道",
      states: {
        idle: "空闲",
        ready: "就绪",
        playing: "播放中",
      },
      local: {
        title: "Pomodorii App Channel",
        ready: "已准备好播放内置主题。",
        playing: "正在通过内置 Web Audio 频道播放。",
        togglePlay: "切换 Pomodorii App Channel 播放",
        volume: "本地频道音量",
      },
      youtube: {
        attribution: "来源：",
        clickToStart: "在播放器中点击播放，从开头开始。",
        openOnYoutube: "在 YouTube 中打开",
        loadError: "无法在这里加载 YouTube 嵌入播放器，请打开原始视频。",
      },
    },
  },
};

const DEFAULT_SETTINGS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  autoCheckTasks: false,
  checkToBottom: false,
  reduceMotion: false,
};

type Mode = "focus" | "short" | "long";
type Settings = typeof DEFAULT_SETTINGS;

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STATUS_STYLES = {
  finished: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
  running: "bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400",
  paused: "bg-white/50 dark:bg-gray-800/50 border-white dark:border-gray-700 text-gray-400 dark:text-gray-500",
  ready: "bg-white/50 dark:bg-gray-800/50 border-white dark:border-gray-700 text-cyan-600 dark:text-cyan-400 backdrop-blur-sm",
} as const;

const WiiInput = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  label?: string;
}) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-bold text-gray-400 uppercase ml-1">{label}</label>}
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-600 dark:text-gray-200 font-bold text-center focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
    />
  </div>
);

const WiiToggle = ({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{label}</span>
    <div
      onClick={onToggle}
      className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
        checked ? "bg-cyan-400 dark:bg-cyan-600" : "bg-gray-200 dark:bg-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white dark:bg-gray-100 rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </div>
  </div>
);

const TaskItem = ({
  task,
  toggleTask,
  deleteTask,
  onPickup,
  onDrop,
}: {
  task: Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  onPickup: () => void;
  onDrop: () => void;
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      dragListener={false}
      dragControls={controls}
      onDragStart={onPickup}
      onDragEnd={onDrop}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`group flex items-center justify-between p-3 rounded-xl relative ${
        task.completed
          ? "wii-panel-pressed opacity-60"
          : "wii-panel shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          onPointerDown={(e) => controls.start(e)}
          className="flex flex-col gap-0.5 px-1 cursor-grab active:cursor-grabbing opacity-30 hover:opacity-60 transition-opacity touch-none py-1"
        >
          <div className="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-400"></div>
          <div className="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-400"></div>
          <div className="w-0.5 h-0.5 rounded-full bg-gray-500 dark:bg-gray-400"></div>
        </div>
        <button
          onClick={() => toggleTask(task.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? "border-green-400 bg-green-400"
              : "border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-400"
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>
        <span
          className={`text-sm font-medium truncate ${
            task.completed ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-600 dark:text-gray-200"
          }`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </Reorder.Item>
  );
};

export default function Home() {
  const [currentMode, setCurrentMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<RadioChannelId>("pomodorii-main-theme");
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [localVolume, setLocalVolume] = useState(15);
  const [youtubeState, setYoutubeState] = useState<RadioPlaybackState>("idle");
  const [shouldLoadYouTube, setShouldLoadYouTube] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [language, setLanguage] = useState<Language>("en");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const { theme, setTheme } = useTheme();

  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const radioLauncherRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[language];

  const getModeMinutes = (mode: Mode) =>
    mode === "focus" ? settings.pomodoro : mode === "short" ? settings.shortBreak : settings.longBreak;

  const timerStatus = isFinished
    ? "finished" as const
    : isRunning
    ? "running" as const
    : timeLeft < getModeMinutes(currentMode) * 60
    ? "paused" as const
    : "ready" as const;

  const statusText = ({
    ready: t.status.ready,
    running: currentMode === "focus" ? t.status.focusing : t.status.break,
    paused: t.status.paused,
    finished: t.status.finished,
  })[timerStatus];

  const statusClass = `px-4 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold shadow-sm ${STATUS_STYLES[timerStatus]}`;

  const sounds = useRef<{ [key: string]: HTMLAudioElement } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const loopStartRef = useRef<number>(0);
  const loopEndRef = useRef<number>(0);
  const [isAudioContextReady, setIsAudioContextReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const activeChannel = getRadioChannel(activeChannelId) ?? RADIO_CHANNELS[0];
  const localChannel = getRadioChannel("pomodorii-main-theme") as Extract<(typeof RADIO_CHANNELS)[number], { provider: "local" }>;
  const youtubeChannel = getRadioChannel("sanctuary-os") as Extract<(typeof RADIO_CHANNELS)[number], { provider: "youtube" }>;
  const activePlaybackState: RadioPlaybackState =
    activeChannel.provider === "local"
      ? localIsPlaying
        ? "playing"
        : isAudioContextReady
          ? "ready"
          : "idle"
      : youtubeState;
  const radioPillStateLabel =
    activePlaybackState === "playing"
      ? t.radio.states.playing
      : activePlaybackState === "ready" || activePlaybackState === "paused"
        ? t.radio.states.ready
        : t.radio.states.idle;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sounds.current = {
        'button-press': new Audio('/sound-fx/button-press.wav'),
        'close-delete': new Audio('/sound-fx/close-delete.wav'),
        'alarm': new Audio('/sound-fx/alarm.wav'),
        'shift': new Audio('/sound-fx/shift.wav'),
        'start-chime': new Audio('/sound-fx/start-chime.wav'),
        'toggle': new Audio('/sound-fx/toggle.wav'),
        'task-pickup': new Audio('/sound-fx/task-pickup.wav'),
        'task-drop': new Audio('/sound-fx/task-drop.wav'),
      };
      Object.values(sounds.current).forEach(audio => {
        audio.preload = 'auto';
        audio.volume = 0.5;
      });

      const initAudio = async () => {
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;
  
          const gainNode = ctx.createGain();
          gainNode.connect(ctx.destination);
          gainNodeRef.current = gainNode;
  
          const response = await fetch(`${localChannel.filePath}?v=${Date.now()}`);
          const arrayBuffer = await response.arrayBuffer();
          const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
          
          const channelData = decodedBuffer.getChannelData(0);
          let start = 0;
          let end = channelData.length;
          const threshold = 0.01;

          for (let i = 0; i < channelData.length; i++) {
            if (Math.abs(channelData[i]) > threshold) {
              start = i;
              break;
            }
          }

          for (let i = channelData.length - 1; i >= 0; i--) {
            if (Math.abs(channelData[i]) > threshold) {
              end = i + 1;
              break;
            }
          }

          audioBufferRef.current = decodedBuffer;
          loopStartRef.current = start / decodedBuffer.sampleRate;
          loopEndRef.current = end / decodedBuffer.sampleRate;
          
          setIsAudioContextReady(true);
        } catch {
          // Audio init can fail if the browser blocks autoplay
        }
      };
  
      initAudio();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [localChannel.filePath]);

  const playSound = useCallback((sound: 'button-press' | 'close-delete' | 'alarm' | 'shift' | 'start-chime' | 'toggle' | 'task-pickup' | 'task-drop', force = false, pitch = 1) => {
    if (!sounds.current) return;
    if (!force && isMuted) return;
    
    const audio = sounds.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.playbackRate = pitch;
      audio.play().catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    if (!isAudioContextReady) return;

    const ctx = audioContextRef.current;
    const buffer = audioBufferRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !buffer || !gainNode) return;
    
    if (localIsPlaying) {
      ctx.resume().then(() => {
        if (!musicSourceRef.current) {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          source.loopStart = loopStartRef.current;
          source.loopEnd = loopEndRef.current;
          source.connect(gainNode);
          source.start(0, loopStartRef.current);
          musicSourceRef.current = source;
        }
      });
    } else {
      if (ctx.state === 'running') {
        ctx.suspend();
      }
    }
  }, [localIsPlaying, isAudioContextReady]);

  useEffect(() => {
    if (!gainNodeRef.current || !audioContextRef.current) return;
    const volume = isMuted ? 0 : localVolume / 100;
    const currentTime = audioContextRef.current.currentTime;
    gainNodeRef.current.gain.cancelScheduledValues(currentTime);
    gainNodeRef.current.gain.setTargetAtTime(volume, currentTime, 0.1);
  }, [localVolume, isMuted, isAudioContextReady]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${t.appTitle}`;
  }, [timeLeft, language, t.appTitle]);

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    playSound("button-press");
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = useCallback((id: string) => {
    playSound("button-press");
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id);
      if (taskIndex === -1) return prev;

      const updatedTasks = [...prev];
      const task = { ...updatedTasks[taskIndex] };
      task.completed = !task.completed;
      updatedTasks[taskIndex] = task;

      if (settings.checkToBottom && task.completed) {
        updatedTasks.splice(taskIndex, 1);
        updatedTasks.push(task);
      }

      return updatedTasks;
    });
  }, [settings.checkToBottom, playSound]);

  const deleteTask = (id: string) => {
    playSound("close-delete");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const switchMode = useCallback((mode: Mode) => {
    playSound("button-press", false, 0.9 + Math.random() * 0.2);
    setCurrentMode(mode);
    setIsRunning(false);
    const minutes = mode === "focus" ? settings.pomodoro : mode === "short" ? settings.shortBreak : settings.longBreak;
    setTimeLeft(minutes * 60);
  }, [playSound, settings]);

  const resetTimer = useCallback(() => {
    playSound("button-press");
    setIsRunning(false);
    const minutes = currentMode === "focus" ? settings.pomodoro : currentMode === "short" ? settings.shortBreak : settings.longBreak;
    setTimeLeft(minutes * 60);
  }, [playSound, currentMode, settings]);

  const handleTimerComplete = useCallback(() => {
    playSound("alarm");
    setIsRunning(false);
    setIsFinished(true);
    if (timerInterval.current) clearInterval(timerInterval.current);
    setTimeout(() => setIsFinished(false), 2000);

    if (currentMode === "focus") {
      const newCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompleted);

      if (settings.autoCheckTasks) {
        setTasks((prev) => {
          const idx = prev.findIndex((t) => !t.completed);
          if (idx === -1) return prev;
          const updatedTasks = [...prev];
          const task = { ...updatedTasks[idx], completed: true };
          updatedTasks[idx] = task;
          if (settings.checkToBottom) {
            updatedTasks.splice(idx, 1);
            updatedTasks.push(task);
          }
          return updatedTasks;
        });
      }

      if (settings.autoStartBreaks) {
        const nextMode = newCompleted % settings.longBreakInterval === 0 ? "long" : "short";
        switchMode(nextMode as Mode);
        setIsRunning(true);
      }
    } else if (settings.autoStartPomodoros) {
      switchMode("focus");
      setIsRunning(true);
    }
  }, [currentMode, pomodorosCompleted, settings, playSound, switchMode]);

  const onTimerComplete = useRef(handleTimerComplete);
  useEffect(() => { onTimerComplete.current = handleTimerComplete; });

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      return;
    }

    timerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        if (prev === 1) {
          requestAnimationFrame(() => onTimerComplete.current());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = useCallback(() => {
    playSound(isRunning ? "close-delete" : "button-press");
    setIsRunning(!isRunning);
  }, [isRunning, playSound]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };

      if (!isRunning && typeof value === "number") {
        if (key === "pomodoro" && currentMode === "focus") setTimeLeft(value * 60);
        if (key === "shortBreak" && currentMode === "short") setTimeLeft(value * 60);
        if (key === "longBreak" && currentMode === "long") setTimeLeft(value * 60);
      }
      return newSettings;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        toggleTimer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTimer]);

  const toggleRadioDrawer = useCallback(() => {
    if (isRadioOpen) {
      playSound("close-delete");
      setIsRadioOpen(false);
      return;
    }

    playSound("button-press");
    setIsRadioOpen(true);
  }, [isRadioOpen, playSound]);

  const closeRadioDrawer = useCallback(() => {
    if (!isRadioOpen) return;
    playSound("close-delete");
    setIsRadioOpen(false);
  }, [isRadioOpen, playSound]);

  const handleChannelSelect = useCallback((channelId: RadioChannelId) => {
    playSound("button-press");

    if (channelId === "sanctuary-os") {
      setShouldLoadYouTube(true);
      setLocalIsPlaying(false);
      setYoutubeState("idle");
    } else if (activeChannelId === "sanctuary-os") {
      setYoutubeState("idle");
    }

    setActiveChannelId(channelId);
  }, [activeChannelId, playSound]);

  useEffect(() => {
    if (!isRadioOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRadioDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeRadioDrawer, isRadioOpen]);

  useEffect(() => {
    if (!isRadioOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!radioLauncherRef.current) return;

      const target = event.target;
      if (target instanceof Node && !radioLauncherRef.current.contains(target)) {
        closeRadioDrawer();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeRadioDrawer, isRadioOpen]);

  return (
    <MotionConfig transition={{ duration: settings.reduceMotion ? 0 : 0.3 }}>
      {/* Force hard cuts for standard CSS transitions when reduceMotion is enabled */}
      {settings.reduceMotion && (
        <style jsx global>{`
          *, *::before, *::after {
            transition-duration: 0s !important;
            animation-duration: 0s !important;
          }
        `}</style>
      )}

      {/* Loading Splash Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={() => {
                setTimeout(() => setIsLoading(false), 1000);
              }}
              className="flex items-center gap-4"
            >
              <audio
                src="/sound-fx/start-chime.wav"
                autoPlay
                onEnded={() => {}}
                ref={(el) => {
                  if (el) el.volume = 0.25;
                }}
              />
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                 <Image src="/pomodorii-icon.png" alt="Pomodorii Icon" fill className="object-cover" priority />
              </div>
              <span className="text-4xl font-bold tracking-tight text-[#9AA1AF] dark:text-gray-100">
                {t.appTitle}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Rainbow Orb Background - Only visible if NOT reduced motion */}
      {!settings.reduceMotion && (
        <div
          id="orb-wrapper"
          className={`fixed inset-0 flex items-center justify-center pointer-events-none z-0 orb-wrapper transition-all duration-700 ${
            isRunning ? "active" : ""
          }`}
        >
          {/* Spinning Rainbow Core */}
          <div className="orb-container relative w-[600px] h-[600px] rounded-full animate-[spin-slow_20s_linear_infinite]">
            <div className="absolute inset-0 rounded-full bg-[#00D3F3] opacity-40 blur-3xl"></div>
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#00D3F3]/30 rounded-full blur-2xl mix-blend-multiply animate-pulse"></div>
            <div
              className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-[#00D3F3]/30 rounded-full blur-2xl mix-blend-multiply animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Center Focus Ring */}
          <div
            id="main-orb"
            className="absolute w-80 h-80 rounded-full border border-white/40 shadow-[0_0_60px_rgba(255,255,255,0.8)] backdrop-blur-sm transition-all duration-700 opacity-50 scale-90"
            style={{
              transform: isRunning ? "scale(1.2)" : "scale(0.9)",
              opacity: isRunning ? 1 : 0.5,
            }}
          ></div>
        </div>
      )}
      
      {/* Static Background for Reduced Motion */}
      {settings.reduceMotion && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 bg-white dark:bg-black transition-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 opacity-50"></div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-20 w-full px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform overflow-hidden relative">
             <Image src="/pomodorii-icon.png" alt="Pomodorii Icon" fill className="object-cover" />
          </div>
          <span className="text-base font-semibold tracking-wide text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
            {t.appTitle}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/The-Lab-by-Ordinary-Company/pomodorii"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound("button-press")}
            className="wii-btn p-2.5 rounded-full bg-white dark:bg-gray-800"
          >
            <Github className="w-5 h-5" />
          </a>
          <button
            onClick={() => {
              setIsSettingsOpen(true);
              playSound("button-press");
            }}
            className="wii-btn p-2.5 rounded-full bg-white dark:bg-gray-800"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 dark:bg-black/50 backdrop-blur-md"
            onClick={() => {
              setIsSettingsOpen(false);
              playSound("close-delete");
            }}
          ></div>

          <div 
            className={`relative w-full max-w-md mx-4 wii-panel rounded-3xl p-8 max-h-[85vh] overflow-y-auto wii-scrollbar ${
              !settings.reduceMotion ? "animate-[float-wii_6s_ease-in-out_infinite]" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-600 dark:text-gray-200 flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-cyan-400" />
                {t.settings.title}
              </h2>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  playSound("close-delete");
                }}
                onMouseEnter={() => playSound("shift")}
                className="wii-btn p-2 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-400 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Timer Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold text-xs tracking-widest uppercase">
                  <Clock className="w-4 h-4" /> {t.settings.timer}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <WiiInput 
                    label={t.settings.pomodoro}
                    value={settings.pomodoro} 
                    onChange={(val) => updateSetting("pomodoro", val)} 
                  />
                  <WiiInput 
                    label={t.settings.shortBreak}
                    value={settings.shortBreak} 
                    onChange={(val) => updateSetting("shortBreak", val)} 
                  />
                  <WiiInput 
                    label={t.settings.longBreak}
                    value={settings.longBreak} 
                    onChange={(val) => updateSetting("longBreak", val)} 
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <WiiToggle
                    label={t.settings.autoStartBreaks}
                    checked={settings.autoStartBreaks}
                    onToggle={() => { updateSetting("autoStartBreaks", !settings.autoStartBreaks); playSound("toggle"); }}
                  />
                  <WiiToggle
                    label={t.settings.autoStartPomodoros}
                    checked={settings.autoStartPomodoros}
                    onToggle={() => { updateSetting("autoStartPomodoros", !settings.autoStartPomodoros); playSound("toggle"); }}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-gray-600">{t.settings.longBreakInterval}</span>
                  <div className="w-20">
                    <WiiInput 
                      value={settings.longBreakInterval} 
                      onChange={(val) => updateSetting("longBreakInterval", val)} 
                    />
                  </div>
                </div>
              </div>

              {/* Task Settings */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs tracking-widest uppercase">
                  <List className="w-4 h-4" /> {t.settings.task}
                </div>
                
                <div className="space-y-3">
                  <WiiToggle
                    label={t.settings.autoCheck}
                    checked={settings.autoCheckTasks}
                    onToggle={() => { updateSetting("autoCheckTasks", !settings.autoCheckTasks); playSound("toggle"); }}
                  />
                  <WiiToggle
                    label={t.settings.checkToBottom}
                    checked={settings.checkToBottom}
                    onToggle={() => { updateSetting("checkToBottom", !settings.checkToBottom); playSound("toggle"); }}
                  />
                </div>
              </div>

              {/* Theme & Accessibility */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs tracking-widest uppercase">
                  <Monitor className="w-4 h-4" /> {t.settings.theme}
                </div>
                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      setTheme("light");
                      playSound("button-press");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      theme === "light" 
                        ? "bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-cyan-600 dark:text-cyan-400" 
                        : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Sun className="w-4 h-4" /> {t.settings.light}
                  </button>
                  <button 
                    onClick={() => {
                      setTheme("dark");
                      playSound("button-press");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      theme === "dark" 
                        ? "bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-cyan-600 dark:text-cyan-400" 
                        : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Moon className="w-4 h-4" /> {t.settings.dark}
                  </button>
                  <button 
                    onClick={() => {
                      setTheme("system");
                      playSound("button-press");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      theme === "system" 
                        ? "bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-cyan-600 dark:text-cyan-400" 
                        : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Monitor className="w-4 h-4" /> {t.settings.system}
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs tracking-widest uppercase">
                  <Globe className="w-4 h-4" /> {t.settings.language}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "en", name: "English" },
                    { id: "ja", name: "日本語" },
                    { id: "es", name: "Español" },
                    { id: "zh", name: "中文" },
                  ].map((langOption) => (
                    <button
                      key={langOption.id}
                      onClick={() => {
                        setLanguage(langOption.id as Language);
                        playSound("button-press");
                      }}
                      className={`wii-btn py-3 px-4 rounded-xl text-sm font-semibold ${
                        language === langOption.id
                          ? "border-cyan-200 text-cyan-600 bg-cyan-50"
                          : "text-gray-500"
                      }`}
                    >
                      {langOption.name}
                      {language === langOption.id && (
                        <Check className="w-4 h-4 ml-auto text-cyan-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs tracking-widest uppercase">
                  <Zap className="w-4 h-4" /> {t.settings.accessibility}
                </div>
                <WiiToggle
                  label={t.settings.reduceMotion}
                  checked={settings.reduceMotion}
                  onToggle={() => { updateSetting("reduceMotion", !settings.reduceMotion); playSound("toggle"); }}
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2 mb-2">{t.settings.reduceMotionDesc}</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pb-32 md:pb-36 w-full">
        <div
          className="w-full max-w-sm flex flex-col items-center gap-10"
          style={{ 
            animation: !settings.reduceMotion ? "float-wii 6s ease-in-out infinite" : "none"
          }}
        >
          {/* Mode Toggles */}
          <div className="flex items-center gap-1 p-1.5 wii-panel rounded-full relative">
            {(["focus", "short", "long"] as Mode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                className={`relative z-10 px-6 py-2 text-xs font-semibold rounded-full transition-colors duration-300 ${
                  currentMode === mode
                    ? "text-cyan-700 dark:text-cyan-100"
                    : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                {mode === "focus"
                  ? t.modes.focus
                  : mode === "short"
                  ? t.modes.short
                  : t.modes.long}
                {currentMode === mode && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 wii-pill-active rounded-full -z-10"
                    transition={
                      settings.reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }
                    }
                  />
                )}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative group text-center">
            <h1
              id="timer-display"
              className={`text-8xl md:text-9xl font-light tracking-tighter timer-nums transition-colors duration-500 select-none ${
                isRunning ? "active" : ""
              } ${isFinished ? "text-green-500" : ""}`}
            >
              {formatTime(timeLeft)}
          </h1>
            <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className={statusClass}>{statusText}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8 mt-2">
            <button
              onClick={resetTimer}
              className="wii-btn p-5 rounded-full group"
            >
              <RotateCcw className="w-6 h-6 transition-transform group-hover:-rotate-180 text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400" />
            </button>

            <button
              onClick={toggleTimer}
              className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,1)] dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-gray-100 dark:border-gray-700 group ${
                isRunning ? "ring-4 ring-cyan-100 dark:ring-cyan-900/50" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-full border-4 border-gray-50 dark:border-gray-700 group-hover:border-cyan-100 dark:group-hover:border-cyan-900/50 transition-colors"></div>
              {isRunning ? (
                <Pause className="w-10 h-10 text-cyan-400 fill-current z-10" />
              ) : (
                <Play className="w-10 h-10 ml-1 text-gray-300 dark:text-gray-600 fill-current group-hover:text-cyan-400 transition-colors z-10" />
              )}
            </button>

            <button
              className="wii-btn p-5 rounded-full group"
              onClick={() => {
                setIsMuted(!isMuted);
                playSound("button-press", true);
              }}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400" />
              ) : (
                <Volume2 className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400" />
              )}
            </button>
          </div>

          {/* Task Input Area */}
          <div className="mt-8 w-full px-4 flex flex-col gap-4">
            {/* Task List */}
            <div className="w-full pr-1">
              <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      toggleTask={toggleTask}
                      deleteTask={deleteTask}
                      onPickup={() => playSound("task-pickup")}
                      onDrop={() => playSound("task-drop")}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>

            {/* Add New Task */}
            <div className="relative group wii-panel rounded-2xl overflow-hidden shadow-sm">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
                placeholder={t.tasks.placeholder}
                className="w-full bg-transparent py-4 px-6 text-sm text-gray-600 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white/50 dark:focus:bg-gray-800/50 transition-colors font-medium text-center"
              />
              <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 w-0 group-hover:w-full transition-all duration-500 ease-out mx-auto right-0"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 w-full px-4 pb-6 pt-4 pointer-events-none">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 pointer-events-none">
          <div
            ref={radioLauncherRef}
            className="radio-launcher relative flex w-full flex-col items-center gap-4 pointer-events-auto"
          >
            <RadioDrawer
              isOpen={isRadioOpen}
              onClose={closeRadioDrawer}
              onHoverClose={() => playSound("shift")}
              reduceMotion={settings.reduceMotion}
              title={t.radio.title}
              subtitle={t.radio.subtitle}
              cards={RADIO_CHANNELS.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  isActive={channel.id === activeChannelId}
                  onClick={() => handleChannelSelect(channel.id)}
                  provider={channel.provider}
                  subtitle={channel.subtitle}
                  title={channel.title}
                />
              ))}
            >
              {activeChannel.provider === "local" ? (
                <LocalChannelPanel
                  isPlaying={localIsPlaying}
                  onTogglePlayback={() => {
                    playSound(localIsPlaying ? "close-delete" : "button-press");
                    setLocalIsPlaying((current) => !current);
                  }}
                  onVolumeChange={setLocalVolume}
                  playLabel={t.radio.local.playing}
                  readyLabel={t.radio.local.ready}
                  reduceMotion={settings.reduceMotion}
                  title={t.radio.local.title}
                  toggleLabel={t.radio.local.togglePlay}
                  trackLabel={localChannel.trackLabel}
                  volume={localVolume}
                  volumeLabel={t.radio.local.volume}
                />
              ) : (
                <YouTubeChannelPanel
                  attributionLabel={t.radio.youtube.attribution}
                  channel={youtubeChannel}
                  clickToStartLabel={t.radio.youtube.clickToStart}
                  errorLabel={t.radio.youtube.loadError}
                  muted={isMuted}
                  onStateChange={setYoutubeState}
                  openLinkLabel={t.radio.youtube.openOnYoutube}
                  shouldLoad={shouldLoadYouTube}
                />
              )}
            </RadioDrawer>

            <RadioPill
              channelTitle={activeChannel.title}
              isOpen={isRadioOpen}
              isPlaying={activePlaybackState === "playing"}
              onToggle={toggleRadioDrawer}
              reduceMotion={settings.reduceMotion}
              stateLabel={radioPillStateLabel}
              title={t.radio.title}
            />
          </div>
        </div>
      </footer>
      
      {/* Version Display */}
      <div className="fixed bottom-4 right-4 z-10 pointer-events-none">
        <span className="text-xs font-bold text-gray-300 dark:text-gray-600 tracking-widest">
          {t.settings.credits.version}
        </span>
      </div>
    </MotionConfig>
  );
}
