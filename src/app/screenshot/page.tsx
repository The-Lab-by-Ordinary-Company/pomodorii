import React from "react";

export default function ScreenshotPage() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center overflow-hidden relative">
      {/* Spinning Rainbow Core */}
      <div className="orb-container relative w-[600px] h-[600px] rounded-full animate-[spin-slow_20s_linear_infinite]">
        <div className="absolute inset-0 rounded-full rainbow-gradient opacity-40 blur-3xl"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-cyan-400/30 rounded-full blur-2xl mix-blend-multiply animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-400/30 rounded-full blur-2xl mix-blend-multiply animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Center Focus Ring - Static for screenshot */}
      <div className="absolute w-80 h-80 rounded-full border border-white/40 shadow-[0_0_60px_rgba(255,255,255,0.8)] backdrop-blur-sm opacity-50 scale-90"></div>
    </div>
  );
}

