import type { RadioChannel, RadioChannelId } from "./types";

export const RADIO_CHANNELS: readonly RadioChannel[] = [
  {
    id: "pomodorii-main-theme",
    provider: "local",
    title: "Pomodorii App Channel",
    subtitle: "Built into Pomodorii",
    trackLabel: "Pomodorii Main Theme",
    filePath: "/sound-fx/main-theme.wav",
  },
  {
    id: "sanctuary-os",
    provider: "youtube",
    title: "Sanctuary OS",
    subtitle: "Album channel via YouTube",
    trackLabel: "Sanctuary OS (Atmospheric Breaks/Jungle/Frutiger Aero/Nintendo/Dreamcast)",
    videoId: "d3KfkKXRDzk",
    startSeconds: 0,
    externalUrl: "https://www.youtube.com/watch?v=d3KfkKXRDzk",
  },
] as const;

export const getRadioChannel = (channelId: RadioChannelId) =>
  RADIO_CHANNELS.find((channel) => channel.id === channelId);
