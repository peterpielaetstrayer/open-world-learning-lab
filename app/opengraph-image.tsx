import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(168deg, #faf8f5 0%, #e8eef3 72%, #e4ebe8 100%)",
          color: "#1a2332",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8a8278",
            }}
          >
            Independent education design lab
          </div>
          <div style={{ fontSize: 56, lineHeight: 1.1, maxWidth: 900 }}>
            Learning should begin with the world.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 28, color: "#4a7c9b" }}>Open World Learning Lab</div>
          <div style={{ fontSize: 16, color: "#8a8278" }}>openworldlearninglab.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
