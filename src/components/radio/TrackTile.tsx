"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import type { YouTubeTrack } from "@/lib/radio/types";

type TrackTileProps = {
  fullTitle?: string;
  isActive: boolean;
  isPlaying: boolean;
  nowPlayingLabel: string;
  onSelect: () => void;
  reduceMotion: boolean;
  track: YouTubeTrack;
};

export function TrackTile({
  fullTitle,
  isActive,
  isPlaying,
  nowPlayingLabel,
  onSelect,
  reduceMotion,
  track,
}: TrackTileProps) {
  const [thumbSrc, setThumbSrc] = useState(
    `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      title={fullTitle ?? track.title}
      aria-pressed={isActive}
      className={`dusqk-track-tile group ${isActive ? "dusqk-track-tile-active" : ""} ${
        isActive && isPlaying && !reduceMotion ? "dusqk-track-tile-pulse" : ""
      }`}
    >
      <div className="dusqk-track-thumb-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbSrc}
          alt={fullTitle ?? track.title}
          loading="lazy"
          onError={() =>
            setThumbSrc(
              `https://i.ytimg.com/vi/${track.videoId}/mqdefault.jpg`
            )
          }
          className="dusqk-track-thumb"
        />

        {track.durationLabel && (
          <span className="dusqk-track-duration">{track.durationLabel}</span>
        )}

        <div className="dusqk-track-thumb-overlay" aria-hidden="true" />

        <div className="dusqk-track-play" aria-hidden="true">
          <Play className="h-4 w-4 fill-current" />
        </div>

        {isActive && (
          <span className="dusqk-track-badge">
            <span className="dusqk-track-badge-dot" aria-hidden="true" />
            {nowPlayingLabel}
          </span>
        )}
      </div>

      <div className="dusqk-track-meta">
        <div className="dusqk-track-title">{track.title}</div>
        {track.subtitle && (
          <div className="dusqk-track-subtitle">{track.subtitle}</div>
        )}
      </div>
    </button>
  );
}
