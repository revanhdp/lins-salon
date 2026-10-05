import type { MetadataRoute } from "next";
import { salon } from "@/data/salon";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${salon.siteUrl}/sitemap.xml`,
  };
}
