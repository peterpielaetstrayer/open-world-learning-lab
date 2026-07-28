"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { VisualTheme } from "@/content/visual-assets";
import { getVisualAsset, resolveVisualSrc } from "@/content/visual-assets";
import VisualFallback from "./VisualFallback";

export type VisualPlateProps = {
  id?: string;
  assetKey?: string;
  title?: string;
  eyebrow?: string;
  caption?: string;
  src?: string | null;
  mobileSrc?: string | null;
  alt?: string;
  aspect?: "hero" | "landscape" | "wide" | "portrait";
  theme?: VisualTheme;
  focalPosition?: string;
  mobileFocalPosition?: string;
  fallbackVariant?: "hero" | "landscape" | "wide" | "portrait" | "coastal" | "zones" | "journey";
  overlay?: ReactNode;
  overlayLabels?: string[];
  priority?: boolean;
  className?: string;
};

const aspectRatios = {
  hero: "aspect-[16/9]",
  landscape: "aspect-[16/10]",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
};

export default function VisualPlate({
  id,
  assetKey,
  title,
  eyebrow,
  caption,
  src: srcProp,
  mobileSrc: mobileSrcProp,
  alt: altProp,
  aspect = "landscape",
  theme = "owll",
  focalPosition: focalProp,
  mobileFocalPosition: mobileFocalProp,
  fallbackVariant,
  overlay,
  overlayLabels,
  priority = false,
  className = "",
}: VisualPlateProps) {
  const asset = assetKey ? getVisualAsset(assetKey) : undefined;
  const desktopSrc = srcProp ?? asset?.desktopSrc ?? null;
  const mobileSrc = mobileSrcProp ?? asset?.mobileSrc ?? null;
  const alt = altProp ?? asset?.alt ?? title ?? "Visual field plate";
  const captionText = caption ?? asset?.caption;
  const focalPosition = focalProp ?? asset?.focalPosition ?? "50% 50%";
  const mobileFocalPosition = mobileFocalProp ?? asset?.mobileFocalPosition ?? focalPosition;
  const hasImage = Boolean(desktopSrc);

  const fallback = fallbackVariant ?? (theme === "first-landing" ? "coastal" : theme === "tahoe" ? "zones" : theme === "saturdays" ? "journey" : "hero");

  return (
    <figure id={id} className={`group ${className}`}>
      {(eyebrow || title) && (
        <figcaption className="sr-only">
          {eyebrow && `${eyebrow}. `}
          {title}
        </figcaption>
      )}
      <div className={`relative overflow-hidden rounded-lg border border-border bg-soft-paper ${aspectRatios[aspect]}`}>
        {hasImage ? (
          <>
            <picture>
              {mobileSrc && (
                <source media="(max-width: 767px)" srcSet={mobileSrc} />
              )}
              <Image
                src={desktopSrc!}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1320px"
                className="object-cover hidden md:block"
                style={{ objectPosition: focalPosition }}
              />
              <Image
                src={mobileSrc ?? desktopSrc!}
                alt={alt}
                fill
                priority={priority}
                sizes="100vw"
                className="object-cover md:hidden"
                style={{ objectPosition: mobileFocalPosition }}
              />
            </picture>
          </>
        ) : (
          <VisualFallback
            theme={theme}
            variant={fallback}
            overlayLabels={overlayLabels}
            className="absolute inset-0"
          />
        )}
        {overlay && (
          <div className="pointer-events-none absolute inset-0 hidden md:block">{overlay}</div>
        )}
      </div>
      {captionText && (
        <figcaption className="mt-3 font-mono text-metadata text-quiet leading-relaxed">
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
