export type RadioProvider = "local" | "youtube";
export type RadioChannelId = "pomodorii-main-theme" | "dusqk" | "ordinary-company";
export type RadioPlaybackState = "idle" | "ready" | "playing" | "paused";

export type YouTubeTrack = {
  id: string;
  videoId: string;
  title: string;
  subtitle?: string;
  durationLabel?: string;
  startSeconds?: number;
};

export type RadioChannel =
  | {
      id: "pomodorii-main-theme";
      provider: "local";
      title: string;
      subtitle: string;
      trackLabel: string;
      filePath: string;
    }
  | {
      id: "dusqk" | "ordinary-company";
      provider: "youtube";
      title: string;
      subtitle: string;
      trackLabel: string;
      videoId: string;
      startSeconds: number;
      externalUrl: string;
      artist?: string;
      tracks?: readonly YouTubeTrack[];
    };
