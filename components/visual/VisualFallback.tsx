import type { VisualTheme } from "@/content/visual-assets";

interface VisualFallbackProps {
  theme?: VisualTheme;
  variant?: "hero" | "landscape" | "wide" | "portrait" | "coastal" | "zones" | "journey" | "spine";
  className?: string;
  overlayLabels?: string[];
  showMobileLabels?: boolean;
}

const themeColors: Record<VisualTheme, { primary: string; secondary: string; tertiary: string }> = {
  owll: { primary: "#2f6672", secondary: "#526b50", tertiary: "#9b6848" },
  "first-landing": { primary: "#2f6672", secondary: "#cad2cc", tertiary: "#9b6848" },
  locus: { primary: "#102620", secondary: "#526b50", tertiary: "#d1a24f" },
  saturdays: { primary: "#526b50", secondary: "#d1a24f", tertiary: "#e7e1d4" },
  tahoe: { primary: "#2f6672", secondary: "#102620", tertiary: "#cad2cc" },
};

function HeroFallback({ theme, overlayLabels }: { theme: VisualTheme; overlayLabels?: string[] }) {
  const c = themeColors[theme];
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`grad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.08" />
          <stop offset="100%" stopColor={c.secondary} stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="#f2efe6" />
      <rect width="800" height="450" fill={`url(#grad-${theme})`} />
      {[80, 140, 200, 260, 320, 380].map((y) => (
        <path
          key={y}
          d={`M0 ${y} Q200 ${y - 20} 400 ${y + 10} T800 ${y - 5}`}
          fill="none"
          stroke={c.primary}
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      ))}
      <path
        d="M120 380 C220 300 340 320 480 260 C620 200 700 240 760 180"
        fill="none"
        stroke={c.tertiary}
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      {[
        { x: 180, y: 280 },
        { x: 380, y: 220 },
        { x: 560, y: 300 },
        { x: 680, y: 200 },
      ].map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r="4" fill={c.primary} fillOpacity="0.4" />
          <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke={c.primary} strokeOpacity="0.2" />
        </g>
      ))}
      {overlayLabels?.map((label, i) => {
        const positions = [
          { x: 140, y: 120 },
          { x: 320, y: 80 },
          { x: 500, y: 100 },
          { x: 620, y: 160 },
          { x: 200, y: 200 },
          { x: 450, y: 180 },
        ];
        const pos = positions[i];
        if (!pos) return null;
        return (
          <g key={label}>
            <rect x={pos.x - 4} y={pos.y - 14} width={label.length * 7 + 12} height="20" rx="2" fill="rgba(242,239,230,0.85)" />
            <text x={pos.x + 2} y={pos.y} fontSize="10" fill="#17201d" fontFamily="system-ui">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function CoastalFallback({ theme }: { theme: VisualTheme }) {
  const c = themeColors[theme];
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="500" fill="#f2efe6" />
      <path d="M0 320 Q200 280 400 300 T800 270 L800 500 L0 500 Z" fill={c.primary} fillOpacity="0.12" />
      <path d="M0 350 Q250 310 500 340 T800 310 L800 500 L0 500 Z" fill={c.secondary} fillOpacity="0.08" />
      {[100, 180, 260, 340].map((y, i) => (
        <path key={y} d={`M0 ${y} Q400 ${y - 15 + i * 5} 800 ${y}`} fill="none" stroke={c.primary} strokeOpacity="0.1" />
      ))}
      <path d="M150 400 C250 360 350 380 450 340 C550 300 650 320 720 280" fill="none" stroke={c.tertiary} strokeOpacity="0.4" strokeDasharray="5 7" />
    </svg>
  );
}

function ZonesFallback({ theme }: { theme: VisualTheme }) {
  const c = themeColors[theme];
  const zones = [
    { label: "Lake", x: 400, y: 280, r: 90 },
    { label: "Mountain", x: 400, y: 120, r: 70 },
    { label: "Trail", x: 180, y: 360, r: 65 },
    { label: "Campfire", x: 620, y: 360, r: 65 },
  ];
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="450" fill="#f2efe6" />
      {zones.map((z) => (
        <g key={z.label}>
          <ellipse cx={z.x} cy={z.y} rx={z.r} ry={z.r * 0.7} fill={c.primary} fillOpacity="0.06" stroke={c.primary} strokeOpacity="0.2" />
          <text x={z.x} y={z.y + 4} textAnchor="middle" fontSize="11" fill="#17201d" fontFamily="system-ui">{z.label}</text>
        </g>
      ))}
      <path d="M180 360 L400 280 L620 360 M400 120 L400 280" stroke={c.tertiary} strokeOpacity="0.3" strokeDasharray="4 6" fill="none" />
    </svg>
  );
}

function JourneyFallback({ theme }: { theme: VisualTheme }) {
  const c = themeColors[theme];
  const steps = ["Arrive", "Reorient", "Notice", "Question", "Practice", "Continue"];
  return (
    <svg viewBox="0 0 800 400" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="400" fill="#f2efe6" />
      <path
        d="M80 200 C160 120 280 140 400 180 C520 220 640 160 720 200"
        fill="none"
        stroke={c.primary}
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      {steps.map((step, i) => {
        const x = 80 + (i / (steps.length - 1)) * 640;
        const y = 200 - Math.sin((i / steps.length) * Math.PI) * 60;
        return (
          <g key={step}>
            <circle cx={x} cy={y} r="6" fill={c.secondary} fillOpacity="0.5" />
            <text x={x} y={y + 24} textAnchor="middle" fontSize="9" fill="#17201d" fontFamily="system-ui">{step}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function VisualFallback({
  theme = "owll",
  variant = "hero",
  className = "",
  overlayLabels,
}: VisualFallbackProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden texture-grid ${className}`} aria-hidden="true">
      {variant === "coastal" && <CoastalFallback theme={theme} />}
      {variant === "zones" && <ZonesFallback theme={theme} />}
      {variant === "journey" && <JourneyFallback theme={theme} />}
      {(variant === "hero" || variant === "landscape" || variant === "wide" || variant === "portrait") && (
        <HeroFallback theme={theme} overlayLabels={overlayLabels} />
      )}
      <div className="pointer-events-none absolute inset-0 border border-ink/5" />
      <span className="absolute bottom-3 left-3 font-mono text-[0.65rem] tracking-wide text-quiet opacity-60">
        Field plate · conceptual
      </span>
    </div>
  );
}
