"use client";

import { Music, Play } from "lucide-react";
import type { RadioProvider } from "@/lib/radio/types";

type ChannelCardProps = {
  isActive: boolean;
  onClick: () => void;
  provider: RadioProvider;
  subtitle: string;
  title: string;
};

export function ChannelCard({
  isActive,
  onClick,
  provider,
  subtitle,
  title,
}: ChannelCardProps) {
  const Icon = provider === "local" ? Music : Play;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`radio-channel-card ${isActive ? "radio-channel-card-active" : ""}`}
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-3.5 text-left">
        <div
          className={`radio-channel-card-icon ${
            isActive ? "bg-cyan-400 text-white" : "bg-white/70 text-gray-400 dark:bg-black/20 dark:text-gray-300"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="radio-channel-card-title">{title}</div>
          <div className="radio-channel-card-subtitle">{subtitle}</div>
        </div>
      </div>
      <div
        className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
          isActive ? "bg-cyan-400 shadow-[0_0_0_6px_rgba(56,189,248,0.18)]" : "bg-gray-200 dark:bg-gray-700"
        }`}
      />
    </button>
  );
}
