"use client";

import { Pause, Play, Volume2 } from "lucide-react";

const VISUALIZER_HEIGHTS = [16, 10, 19, 12, 22];

type LocalChannelPanelProps = {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onVolumeChange: (value: number) => void;
  playLabel: string;
  readyLabel: string;
  reduceMotion: boolean;
  title: string;
  toggleLabel: string;
  trackLabel: string;
  volume: number;
  volumeLabel: string;
};

export function LocalChannelPanel({
  isPlaying,
  onTogglePlayback,
  onVolumeChange,
  playLabel,
  readyLabel,
  reduceMotion,
  title,
  toggleLabel,
  trackLabel,
  volume,
  volumeLabel,
}: LocalChannelPanelProps) {
  return (
    <section className="radio-panel-shell">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="radio-panel-kicker">{title}</div>
          <h3 className="radio-panel-title">{trackLabel}</h3>
          <p className="radio-panel-helper">{isPlaying ? playLabel : readyLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <button
            type="button"
            onClick={onTogglePlayback}
            className="wii-btn h-12 min-w-12 rounded-full px-4"
            aria-label={toggleLabel}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-cyan-500" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-current text-cyan-500" />
            )}
          </button>

          <div className="radio-volume-group">
            <Volume2 className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
            <label className="sr-only" htmlFor="local-radio-volume">
              {volumeLabel}
            </label>
            <input
              id="local-radio-volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-gray-200 accent-cyan-400 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-end gap-1.5">
        {VISUALIZER_HEIGHTS.map((height, index) => (
          <div
            key={height}
            className={`w-2 rounded-full bg-cyan-400/90 transition-all duration-300 ${
              isPlaying && !reduceMotion ? "animate-[pulse_0.85s_ease-in-out_infinite]" : "opacity-35"
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              height: isPlaying ? `${height}px` : "8px",
            }}
          />
        ))}
      </div>
    </section>
  );
}
