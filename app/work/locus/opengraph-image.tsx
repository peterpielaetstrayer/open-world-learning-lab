import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LOCUS — From Experience to Cumulative Growth";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#102620",
          color: "#f2efe6",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${siteConfig.url}/visuals/locus/locus-system-spine.png`}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "28% 50%",
            opacity: 0.28,
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
            background: "linear-gradient(180deg, rgba(16,38,32,0.94) 0%, rgba(16,38,32,0.82) 100%)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase", color: "#cad2cc" }}>
              Learning Infrastructure · Product Prototype
            </div>
            <div style={{ fontSize: 56, lineHeight: 1.08 }}>LOCUS</div>
            <div style={{ fontSize: 24, color: "#e7e1d4", maxWidth: 820 }}>
              From experience to cumulative growth through Field Notes, inquiry, and creation.
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#cad2cc" }}>{siteConfig.name}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
