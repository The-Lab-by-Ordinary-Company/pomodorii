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
    id: "dusqk",
    provider: "youtube",
    title: "Dusqk",
    subtitle: "Atmospheric breaks · jungle",
    trackLabel: "Sanctuary OS (Atmospheric Breaks/Jungle/Frutiger Aero/Nintendo/Dreamcast)",
    videoId: "d3KfkKXRDzk",
    startSeconds: 0,
    externalUrl: "https://www.youtube.com/watch?v=d3KfkKXRDzk",
    artist: "Dusqk",
    tracks: [
      {
        id: "dusqk-sanctuary-os",
        videoId: "d3KfkKXRDzk",
        title: "Sanctuary OS",
        subtitle: "Atmospheric Breaks · Frutiger Aero · Nintendo",
        startSeconds: 0,
      },
      {
        id: "dusqk-gaia-rae",
        videoId: "yU_EpBtqiRk",
        title: "Gaia / RAE",
        subtitle: "Jungle · Breakcore · DnB · Dreamcast · PSX",
        startSeconds: 0,
      },
      {
        id: "dusqk-lost-sanctuary",
        videoId: "sQDIkseZEOo",
        title: "Lost Sanctuary",
        subtitle: "Downtempo jungle · DnB mix",
        startSeconds: 1,
      },
    ],
  },
  {
    id: "ordinary-company",
    provider: "youtube",
    title: "Ordinary Company",
    subtitle: "Jungle · DnB",
    trackLabel: "AUTOMANCER - Jungle/DnB Mix",
    videoId: "Gme2xMgoXY0",
    startSeconds: 0,
    externalUrl: "https://www.youtube.com/watch?v=Gme2xMgoXY0",
    artist: "Ordinary Company",
    tracks: [
      {
        id: "ordinary-company-automancer",
        videoId: "Gme2xMgoXY0",
        title: "AUTOMANCER",
        subtitle: "Jungle · DnB Mix",
        startSeconds: 0,
      },
    ],
  },
] as const;

export const getRadioChannel = (channelId: RadioChannelId) =>
  RADIO_CHANNELS.find((channel) => channel.id === channelId);
