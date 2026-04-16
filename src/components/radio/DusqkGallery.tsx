"use client";

import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  RadioChannel,
  RadioPlaybackState,
  YouTubeTrack,
} from "@/lib/radio/types";
import { TrackTile } from "./TrackTile";
import { useYouTubePlayer } from "./useYouTubePlayer";

type YouTubeChannel = Extract<RadioChannel, { provider: "youtube" }>;

type DusqkGalleryProps = {
  channel: YouTubeChannel;
  clickToStartLabel: string;
  errorLabel: string;
  muted: boolean;
  nowPlayingLabel: string;
  onStateChange: (state: RadioPlaybackState) => void;
  onTrackSelect?: () => void;
  openLinkLabel: string;
  playingLabel: string;
  reduceMotion: boolean;
  shouldLoad: boolean;
};

export function DusqkGallery({
  channel,
  clickToStartLabel,
  errorLabel,
  muted,
  nowPlayingLabel,
  onStateChange,
  onTrackSelect,
  openLinkLabel,
  playingLabel,
  reduceMotion,
  shouldLoad,
}: DusqkGalleryProps) {
  const tracks = useMemo<readonly YouTubeTrack[]>(
    () => channel.tracks ?? [],
    [channel.tracks]
  );

  // Seed the active track from the channel's default videoId so state is stable
  // on first render. Switching artists fully remounts this component (see the
  // `key={activeChannel.id}` prop on the caller), so we don't need a reset
  // effect — the lazy initializer re-runs with the fresh channel.
  const [activeTrackId, setActiveTrackId] = useState<string>(
    () => tracks.find((t) => t.videoId === channel.videoId)?.id ?? tracks[0]?.id ?? channel.id
  );

  const activeTrack = useMemo<YouTubeTrack>(() => {
    return (
      tracks.find((t) => t.id === activeTrackId) ??
      tracks[0] ?? {
        id: channel.id,
        videoId: channel.videoId,
        title: channel.title,
        subtitle: channel.subtitle,
        startSeconds: channel.startSeconds,
      }
    );
  }, [activeTrackId, channel, tracks]);

  const { containerRef, hasError, playerState } = useYouTubePlayer({
    enabled: shouldLoad,
    muted,
    onStateChange,
    startSeconds: activeTrack.startSeconds ?? 0,
    videoId: activeTrack.videoId,
  });

  const isPlaying = playerState === "playing";
  const externalHref = `https://www.youtube.com/watch?v=${activeTrack.videoId}`;

  return (
    <section className="dusqk-gallery">
      {/* Now Playing */}
      <div className="dusqk-nowplaying">
        <div className="dusqk-nowplaying-frame">
          <div className="dusqk-nowplaying-shell">
            <div ref={containerRef} className="h-full w-full" />
          </div>

          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <p className="max-w-sm text-sm text-gray-600 dark:text-gray-300">{errorLabel}</p>
            </div>
          )}
        </div>

        <div className="dusqk-nowplaying-meta">
          <div className="min-w-0">
            <div className="radio-panel-kicker">
              {isPlaying ? playingLabel : nowPlayingLabel}
            </div>
            <div className="dusqk-nowplaying-title" title={activeTrack.title}>
              {activeTrack.title}
            </div>
            {activeTrack.subtitle && (
              <div className="dusqk-nowplaying-subtitle">{activeTrack.subtitle}</div>
            )}
          </div>

          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={openLinkLabel}
            title={openLinkLabel}
            className="radio-external-link"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {!hasError && playerState === "idle" && (
          <div className="radio-panel-note mt-3 inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {clickToStartLabel}
          </div>
        )}
      </div>

      {/* Track gallery */}
      {tracks.length > 0 && (
        <div className="dusqk-gallery-grid">
          {tracks.map((track) => (
            <TrackTile
              key={track.id}
              track={track}
              isActive={track.id === activeTrack.id}
              isPlaying={isPlaying && track.id === activeTrack.id}
              nowPlayingLabel={nowPlayingLabel}
              reduceMotion={reduceMotion}
              onSelect={() => {
                if (track.id === activeTrack.id) return;
                setActiveTrackId(track.id);
                onTrackSelect?.();
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
