import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pomodorii Timer",
  description: "Pomodorii is the most delightful pomodoro timer on the internet. Designed to look like a retro console, custom sounds, and available in 3 languages, this is the only pomodoro timer you need.",
  openGraph: {
    title: "Pomodorii Timer",
    description: "Pomodorii is the most delightful pomodoro timer on the internet. Designed to look like a retro console, custom sounds, and available in 3 languages, this is the only pomodoro timer you need.",
    url: "https://pomodorii.com", // Replace with your actual URL when deployed
    siteName: "Pomodorii",
    images: [
      {
        url: "/Thumbnail.png", // Path relative to the public folder
        width: 1200,
        height: 630,
        alt: "Pomodorii Timer Preview",
      },
    ],
    locale: "en_US",
    alternateLocale: ["ja_JP", "es_ES", "zh_CN"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodorii Timer",
    description: "Pomodorii is the most delightful pomodoro timer on the internet. Designed to look like a retro console, custom sounds, and available in 3 languages, this is the only pomodoro timer you need.",
    images: ["/Thumbnail.png"], // Path relative to the public folder
  },
};

import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col relative selection:bg-cyan-200 selection:text-cyan-900 dark:selection:bg-cyan-800 dark:selection:text-cyan-100`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
