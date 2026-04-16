export type RadioProvider = "local" | "youtube";
export type RadioChannelId = "pomodorii-main-theme" | "sanctuary-os";
export type RadioPlaybackState = "idle" | "ready" | "playing" | "paused";

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
      id: "sanctuary-os";
      provider: "youtube";
      title: string;
      subtitle: string;
      trackLabel: string;
      videoId: string;
      startSeconds: number;
      externalUrl: string;
    };
