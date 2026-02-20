import React from "react";

export const WiiButton: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
}> = ({ children, style, active }) => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)",
        border: active ? "1px solid #38bdf8" : "1px solid #d1d5db",
        boxShadow: active
          ? "0 0 0 4px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)"
          : "0 2px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)",
        borderRadius: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "#0ea5e9" : "#6b7280",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
