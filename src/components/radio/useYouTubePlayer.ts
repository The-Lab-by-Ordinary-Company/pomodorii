"use client";

import { useEffect, useRef, useState } from "react";
import type { RadioPlaybackState } from "@/lib/radio/types";

type YouTubePlayerStateMap = {
  ENDED: number;
  PLAYING: number;
  PAUSED: number;
  BUFFERING: number;
  CUED: number;
  UNSTARTED: number;
};

type YouTubePlayer = {
  destroy: () => void;
  mute: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  unMute: () => void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: {
    host: string;
    height: string;
    videoId: string;
    width: string;
    playerVars: Record<string, number | string>;
    events: {
      onReady: () => void;
      onStateChange: (event: { data: number }) => void;
      onError: () => void;
    };
  }
) => YouTubePlayer;

declare global {
  interface Window {
    YT?: {
      Player: YouTubePlayerConstructor;
      PlayerState: YouTubePlayerStateMap;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

const loadYouTubeApi = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API requires a browser"));
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (existingScript) {
      existingScript.addEventListener("error", () => reject(new Error("Failed to load YouTube API")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load YouTube API"));
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
};

const mapPlayerState = (
  playerState: number,
  stateMap: YouTubePlayerStateMap
): RadioPlaybackState => {
  if (playerState === stateMap.PLAYING) return "playing";
  if (playerState === stateMap.PAUSED) return "paused";
  if (playerState === stateMap.CUED || playerState === stateMap.BUFFERING) return "ready";
  return "idle";
};

type UseYouTubePlayerOptions = {
  enabled: boolean;
  muted: boolean;
  onStateChange: (state: RadioPlaybackState) => void;
  startSeconds: number;
  videoId: string;
};

export const useYouTubePlayer = ({
  enabled,
  muted,
  onStateChange,
  startSeconds,
  videoId,
}: UseYouTubePlayerOptions) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mutedRef = useRef(muted);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [hasError, setHasError] = useState(false);
  const [playerState, setPlayerState] = useState<RadioPlaybackState>("idle");

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    if (!enabled) {
      setPlayerState("idle");
      setHasError(false);
      onStateChange("idle");
      return;
    }

    let cancelled = false;

    const initializePlayer = async () => {
      try {
        await loadYouTubeApi();

        if (cancelled || !containerRef.current || !window.YT?.Player) {
          return;
        }

        const mountNode = document.createElement("div");
        mountNode.style.height = "100%";
        mountNode.style.width = "100%";
        containerRef.current.replaceChildren(mountNode);

        playerRef.current = new window.YT.Player(mountNode, {
          host: "https://www.youtube-nocookie.com",
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            controls: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
            start: startSeconds,
          },
          events: {
            onReady: () => {
              if (!playerRef.current) return;

              if (mutedRef.current) {
                playerRef.current.mute();
              } else {
                playerRef.current.unMute();
              }

              setPlayerState("ready");
              onStateChange("ready");
            },
            onStateChange: (event) => {
              if (!window.YT?.PlayerState || !playerRef.current) return;

              if (event.data === window.YT.PlayerState.ENDED) {
                playerRef.current.seekTo(startSeconds, true);
                playerRef.current.playVideo();
                return;
              }

              const nextState = mapPlayerState(event.data, window.YT.PlayerState);
              setPlayerState(nextState);
              onStateChange(nextState);
            },
            onError: () => {
              setHasError(true);
              setPlayerState("idle");
              onStateChange("idle");
            },
          },
        });
      } catch {
        if (cancelled) return;
        setHasError(true);
        setPlayerState("idle");
        onStateChange("idle");
      }
    };

    initializePlayer();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      containerRef.current?.replaceChildren();
    };
  }, [enabled, onStateChange, startSeconds, videoId]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (muted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  }, [muted]);

  return {
    containerRef,
    hasError,
    playerState,
  };
};
