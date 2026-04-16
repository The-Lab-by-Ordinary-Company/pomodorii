"use client";

import { ChevronUp, Music } from "lucide-react";

const VISUALIZER_HEIGHTS = [8, 14, 10, 16];

type RadioPillProps = {
  channelTitle: string;
  isOpen: boolean;
  isPlaying: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
  stateLabel: string;
  title: string;
};

export function RadioPill({
  channelTitle,
  isOpen,
  isPlaying,
  onToggle,
  reduceMotion,
  stateLabel,
  title,
}: RadioPillProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`radio-pill ${isOpen ? "radio-pill-open" : ""}`}
      aria-expanded={isOpen}
      aria-label={`${title}: ${channelTitle}`}
    >
      <div
        className={`radio-pill-icon ${
          isPlaying || isOpen ? "bg-cyan-400 text-white" : "bg-gray-200 text-gray-400 dark:bg-[#404040] dark:text-gray-300"
        }`}
      >
        <Music className={`h-4 w-4 ${isPlaying && !reduceMotion ? "animate-pulse" : ""}`} />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className="radio-pill-kicker">{title}</div>
        <div className="truncate text-sm font-bold text-gray-600 dark:text-gray-100">{channelTitle}</div>
      </div>

      <div className="hidden items-end gap-1 sm:flex">
        {VISUALIZER_HEIGHTS.map((height, index) => (
          <div
            key={height}
            className={`w-1.5 rounded-full bg-cyan-400 transition-all duration-300 ${
              isPlaying ? "opacity-100" : "opacity-0"
            } ${isPlaying && !reduceMotion ? "animate-[pulse_0.8s_ease-in-out_infinite]" : ""}`}
            style={{
              animationDelay: `${index * 0.08}s`,
              height: isPlaying ? `${height}px` : "4px",
            }}
          />
        ))}
      </div>

      <div className="radio-state-badge">{stateLabel}</div>

      <ChevronUp
        className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-300 dark:text-gray-500 ${
          isOpen ? "rotate-0" : "rotate-180"
        }`}
      />
    </button>
  );
}
