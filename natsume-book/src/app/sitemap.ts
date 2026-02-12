import type { MetadataRoute } from "next";

const base = "https://nastume.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/characters",
    "/episodes",
    "/guestbook",
    "/blog",
    "/admin",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
