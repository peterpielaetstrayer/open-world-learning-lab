import type { Metadata } from "next";
import { siteConfig } from "@/content/shared";

const baseUrl = siteConfig.url;

export function createPageMetadata({
  title,
  description,
  path = "",
  type = "website" as const,
  openGraphImage,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  openGraphImage?: string;
}): Metadata {
  const url = `${baseUrl}${path}`;
  const images = openGraphImage
    ? [{ url: openGraphImage.startsWith("http") ? openGraphImage : openGraphImage, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type,
      locale: "en_US",
      siteName: siteConfig.name,
      url,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}

export const homeMetadata = createPageMetadata({
  title: "Open World Learning Lab — Learning Should Begin With the World",
  description: siteConfig.description,
  path: "/",
  openGraphImage: "/visuals/owll/homepage-learning-landscape.png",
});
