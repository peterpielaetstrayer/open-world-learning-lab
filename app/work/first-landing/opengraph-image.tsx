import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "First Landing Prototype — Water Shapes the Journey";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f2efe6",
          color: "#17201d",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${siteConfig.url}/visuals/first-landing/coastal-systems-field-plate.png`}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "52% 58%",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 64px",
            background: "linear-gradient(180deg, rgba(242,239,230,0.96) 0%, rgba(242,239,230,0.88) 100%)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2f6672" }}>
              Learning Journey · Pilot Design
            </div>
            <div style={{ fontSize: 52, lineHeight: 1.08, maxWidth: 900 }}>First Landing Prototype</div>
            <div style={{ fontSize: 24, color: "#3d4a45", maxWidth: 820 }}>
              Water shapes the journey across Virginia Beach coastal systems.
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#2f6672" }}>{siteConfig.name}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
