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

type LoadVideoByIdArgs =
  | string
  | {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
      suggestedQuality?: string;
    };

type YouTubePlayer = {
  destroy: () => void;
  loadVideoById: (args: LoadVideoByIdArgs) => void;
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
  const startSecondsRef = useRef(startSeconds);
  const videoIdRef = useRef(videoId);
  const onStateChangeRef = useRef(onStateChange);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const isReadyRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [playerState, setPlayerState] = useState<RadioPlaybackState>("idle");

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    startSecondsRef.current = startSeconds;
  }, [startSeconds]);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Mount/unmount player only when `enabled` flips. Track changes are
  // handled via loadVideoById in a separate effect below, so the iframe
  // itself isn't destroyed when switching between playlist tracks.
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    isReadyRef.current = false;
    // Capture container for cleanup — the ref may change by unmount time.
    const container = containerRef.current;

    const initializePlayer = async () => {
      try {
        await loadYouTubeApi();

        if (cancelled || !container || !window.YT?.Player) {
          return;
        }

        const mountNode = document.createElement("div");
        mountNode.style.height = "100%";
        mountNode.style.width = "100%";
        container.replaceChildren(mountNode);

        playerRef.current = new window.YT.Player(mountNode, {
          host: "https://www.youtube-nocookie.com",
          height: "100%",
          width: "100%",
          videoId: videoIdRef.current,
          playerVars: {
            // Autoplay on mount — the player is only ever instantiated in
            // response to a user click on a channel card, so the browser's
            // autoplay gesture window is still active. loadVideoById (used
            // for track swaps) auto-plays by spec, so intra-channel tile
            // clicks are covered too.
            autoplay: 1,
            controls: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
            start: startSecondsRef.current,
          },
          events: {
            onReady: () => {
              if (!playerRef.current) return;

              if (mutedRef.current) {
                playerRef.current.mute();
              } else {
                playerRef.current.unMute();
              }

              isReadyRef.current = true;
              setPlayerState("ready");
              onStateChangeRef.current("ready");
            },
            onStateChange: (event) => {
              if (!window.YT?.PlayerState || !playerRef.current) return;

              if (event.data === window.YT.PlayerState.ENDED) {
                playerRef.current.seekTo(startSecondsRef.current, true);
                playerRef.current.playVideo();
                return;
              }

              const nextState = mapPlayerState(event.data, window.YT.PlayerState);
              setPlayerState(nextState);
              onStateChangeRef.current(nextState);
            },
            onError: () => {
              setHasError(true);
              setPlayerState("idle");
              onStateChangeRef.current("idle");
            },
          },
        });
      } catch {
        if (cancelled) return;
        setHasError(true);
        setPlayerState("idle");
        onStateChangeRef.current("idle");
      }
    };

    initializePlayer();

    return () => {
      cancelled = true;
      isReadyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
      container?.replaceChildren();
      // Reset state via cleanup so we don't call setState in the effect body
      // (which React flags as a cascading render). This runs when `enabled`
      // flips false OR on unmount, both of which legitimately require a reset.
      setPlayerState("idle");
      setHasError(false);
      onStateChangeRef.current("idle");
    };
  }, [enabled]);

  // Hot-swap: when videoId/startSeconds change AFTER the player is ready,
  // call loadVideoById rather than remounting the iframe. This is what
  // gives the Dusqk gallery its smooth track-switching behavior.
  useEffect(() => {
    videoIdRef.current = videoId;
    startSecondsRef.current = startSeconds;

    if (!enabled || !playerRef.current || !isReadyRef.current) return;

    playerRef.current.loadVideoById({ videoId, startSeconds });
  }, [enabled, videoId, startSeconds]);

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
