import type { Metadata } from "next";
import { siteConfig } from "@/content/shared";

const baseUrl = siteConfig.url;

export function createPageMetadata({
  title,
  description,
  path = "",
  type = "website" as const,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${baseUrl}${path}`;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const homeMetadata = createPageMetadata({
  title: "Open World Learning Lab — Learning Should Begin With the World",
  description: siteConfig.description,
  path: "/",
});
