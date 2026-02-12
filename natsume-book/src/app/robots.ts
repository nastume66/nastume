import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/characters", "/episodes", "/guestbook"],
        disallow: ["/admin"],
      },
    ],
    sitemap: "https://nastume.vercel.app/sitemap.xml",
  };
}
