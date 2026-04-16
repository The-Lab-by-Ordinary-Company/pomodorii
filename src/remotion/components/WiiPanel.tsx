import React from "react";

export const WiiPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  bg?: string;
  borderColor?: string;
  insetColor?: string;
}> = ({
  children,
  style,
  bg = "rgba(255, 255, 255, 0.85)",
  borderColor = "rgba(255, 255, 255, 0.6)",
  insetColor = "rgba(255, 255, 255, 1)",
}) => {
  return (
    <div
      style={{
        background: bg,
        backdropFilter: "blur(12px)",
        border: `1px solid ${borderColor}`,
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05), inset 0 1px 0 ${insetColor}`,
        borderRadius: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
