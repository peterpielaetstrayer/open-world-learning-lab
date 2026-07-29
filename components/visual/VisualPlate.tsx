"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { VisualTheme, VisualVariant } from "@/content/visual-assets";
import { getVisualAsset } from "@/content/visual-assets";
import VisualExpandDialog from "./VisualExpandDialog";
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
  theme?: VisualTheme;
  variant?: VisualVariant;
  focalPosition?: string;
  mobileFocalPosition?: string;
  fallbackVariant?: "hero" | "landscape" | "wide" | "portrait" | "coastal" | "zones" | "journey";
  overlayLabels?: string[];
  priority?: boolean;
  expandable?: boolean;
  expandLabel?: string;
  objectPosition?: string;
  className?: string;
  frameClassName?: string;
  showCaption?: boolean;
  children?: ReactNode;
};

const heroLabelPositions = [
  { top: "18%", left: "12%" },
  { top: "32%", left: "28%" },
  { top: "48%", left: "52%" },
  { top: "62%", left: "68%" },
  { top: "78%", left: "42%" },
];

export default function VisualPlate({
  id,
  assetKey,
  title,
  eyebrow,
  caption,
  src: srcProp,
  mobileSrc: mobileSrcProp,
  alt: altProp,
  theme = "owll",
  variant = "hero",
  focalPosition: focalProp,
  mobileFocalPosition: mobileFocalProp,
  fallbackVariant,
  overlayLabels,
  priority = false,
  expandable,
  expandLabel,
  objectPosition,
  className = "",
  frameClassName = "",
  showCaption = true,
  children,
}: VisualPlateProps) {
  const asset = assetKey ? getVisualAsset(assetKey) : undefined;
  const desktopSrc = srcProp ?? asset?.desktopSrc ?? null;
  const mobileSrc = mobileSrcProp ?? asset?.mobileSrc ?? null;
  const alt = altProp ?? asset?.alt ?? title ?? "Visual field plate";
  const captionText = caption ?? asset?.caption;
  const width = asset?.width ?? 1536;
  const height = asset?.height ?? 1024;

  const isPreview = variant === "project-preview";
  const isInfographic = variant === "infographic";
  const isHero = variant === "hero";

  const defaultFocal =
    isPreview && asset?.previewFocalPosition
      ? asset.previewFocalPosition
      : (asset?.focalPosition ?? "50% 50%");
  const focalPosition = objectPosition ?? focalProp ?? defaultFocal;
  const mobileFocalPosition =
    mobileFocalProp ?? asset?.mobileFocalPosition ?? focalPosition;

  const hasImage = Boolean(desktopSrc);
  const shouldExpand =
    expandable ?? (isInfographic && (asset?.containsEmbeddedText ?? false));

  const objectFit = isInfographic ? "object-contain" : "object-cover";
  const imageSizes = isPreview
    ? "(max-width: 768px) 100vw, 480px"
    : isInfographic
      ? "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px"
      : "(max-width: 768px) 100vw, (max-width: 1280px) 56vw, 720px";

  const fallback =
    fallbackVariant ??
    (theme === "first-landing"
      ? "coastal"
      : theme === "tahoe"
        ? "zones"
        : theme === "saturdays"
          ? "journey"
          : "hero");

  const framePadding = isInfographic ? "p-2 sm:p-3" : "";

  return (
    <figure id={id} className={`group ${className}`}>
      {(eyebrow || title) && (
        <figcaption className="sr-only">
          {eyebrow && `${eyebrow}. `}
          {title}
        </figcaption>
      )}

      <div
        className={`relative overflow-hidden rounded-lg border border-border bg-soft-paper ${framePadding} ${frameClassName}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {hasImage ? (
          <>
            {mobileSrc ? (
              <picture className="block h-full w-full">
                <source media="(max-width: 767px)" srcSet={mobileSrc} />
                <Image
                  src={desktopSrc!}
                  alt={alt}
                  fill
                  priority={priority}
                  sizes={imageSizes}
                  className={objectFit}
                  style={{ objectPosition: focalPosition }}
                />
              </picture>
            ) : (
              <>
                <Image
                  src={desktopSrc!}
                  alt={alt}
                  fill
                  priority={priority}
                  sizes={imageSizes}
                  className={`${objectFit} hidden md:block`}
                  style={{ objectPosition: focalPosition }}
                />
                <Image
                  src={desktopSrc!}
                  alt={alt}
                  fill
                  priority={priority}
                  sizes="100vw"
                  className={`${objectFit} md:hidden`}
                  style={{ objectPosition: mobileFocalPosition }}
                />
              </>
            )}

            {isHero &&
              overlayLabels?.map((label, index) => {
                const pos = heroLabelPositions[index];
                if (!pos) return null;
                return (
                  <span
                    key={label}
                    className="pointer-events-none absolute hidden rounded border border-ink/10 bg-page/85 px-2 py-0.5 font-mono text-[0.65rem] tracking-wide text-ink/80 md:inline-block"
                    style={{ top: pos.top, left: pos.left }}
                    aria-hidden="true"
                  >
                    {label}
                  </span>
                );
              })}
          </>
        ) : (
          <VisualFallback
            theme={theme}
            variant={fallback}
            overlayLabels={isHero ? overlayLabels : undefined}
            className="absolute inset-0"
          />
        )}

        {children}
      </div>

      {(showCaption && captionText) || shouldExpand ? (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {showCaption && captionText && (
            <figcaption className="max-w-reading font-mono text-metadata text-quiet leading-relaxed">
              {captionText}
            </figcaption>
          )}
          {shouldExpand && desktopSrc && (
            <VisualExpandDialog
              src={desktopSrc}
              alt={alt}
              width={width}
              height={height}
              triggerLabel={expandLabel ?? "Expand visual"}
              className={showCaption && captionText ? "shrink-0" : ""}
            />
          )}
        </div>
      ) : null}
    </figure>
  );
}
