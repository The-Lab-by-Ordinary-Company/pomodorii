"use client";

import { Disc3, Home, Music } from "lucide-react";
import type { RadioProvider } from "@/lib/radio/types";

type ChannelCardProps = {
  isActive: boolean;
  onClick: () => void;
  pinned?: boolean;
  pinnedLabel?: string;
  provider: RadioProvider;
  subtitle: string;
  title: string;
};

export function ChannelCard({
  isActive,
  onClick,
  pinned,
  pinnedLabel,
  provider,
  subtitle,
  title,
}: ChannelCardProps) {
  const Icon = pinned ? Home : provider === "local" ? Music : Disc3;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`radio-channel-card ${isActive ? "radio-channel-card-active" : ""} ${
        pinned ? "radio-channel-card-pinned" : ""
      }`}
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-3.5 text-left">
        <div
          className={`radio-channel-card-icon ${
            isActive
              ? "bg-cyan-400 text-white"
              : pinned
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-white/70 text-gray-400 dark:bg-black/20 dark:text-gray-300"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          {pinned && pinnedLabel && (
            <span className="radio-channel-card-pinned-kicker">{pinnedLabel}</span>
          )}
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
