import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/shared";
import { projects } from "@/content/projects";
import { releases } from "@/content/releases";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/work",
    "/releases",
    "/releases/owll-at-a-glance",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${base}${p.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const releaseRoutes = releases
    .filter((r) => r.href.startsWith("/releases/"))
    .map((r) => ({
      url: `${base}${r.href}`,
      lastModified: new Date(r.updatedAt ?? r.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...projectRoutes, ...releaseRoutes];
}
