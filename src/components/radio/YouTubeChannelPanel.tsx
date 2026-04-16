"use client";

import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import type { RadioPlaybackState, RadioChannel } from "@/lib/radio/types";
import { useYouTubePlayer } from "./useYouTubePlayer";

type YouTubeChannel = Extract<RadioChannel, { provider: "youtube" }>;

type YouTubeChannelPanelProps = {
  attributionLabel: string;
  channel: YouTubeChannel;
  clickToStartLabel: string;
  errorLabel: string;
  muted: boolean;
  onStateChange: (state: RadioPlaybackState) => void;
  openLinkLabel: string;
  shouldLoad: boolean;
};

export function YouTubeChannelPanel({
  attributionLabel,
  channel,
  clickToStartLabel,
  errorLabel,
  muted,
  onStateChange,
  openLinkLabel,
  shouldLoad,
}: YouTubeChannelPanelProps) {
  const { containerRef, hasError, playerState } = useYouTubePlayer({
    enabled: shouldLoad,
    muted,
    onStateChange,
    startSeconds: channel.startSeconds,
    videoId: channel.videoId,
  });

  return (
    <section className="radio-panel-shell">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="radio-panel-kicker">{channel.title}</div>
          <h3 className="radio-panel-title">{channel.trackLabel}</h3>
          <p className="radio-panel-helper">
            {attributionLabel} Dusqk
          </p>
        </div>
        <a
          href={channel.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={openLinkLabel}
          title={openLinkLabel}
          className="radio-external-link"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="radio-video-frame">
        <div className="radio-video-player-shell">
          <div ref={containerRef} className="h-full w-full" />
        </div>

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <p className="max-w-sm text-sm text-gray-600 dark:text-gray-300">{errorLabel}</p>
          </div>
        )}
      </div>

      {!hasError && playerState === "idle" && (
        <div className="radio-panel-note mt-3 inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {clickToStartLabel}
        </div>
      )}
    </section>
  );
}
