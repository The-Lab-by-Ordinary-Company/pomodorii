import React from "react";

export const WiiPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)",
        borderRadius: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
