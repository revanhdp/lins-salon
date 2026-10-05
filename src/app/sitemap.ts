import type { MetadataRoute } from "next";
import { salon } from "@/data/salon";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: salon.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
