import { MetadataRoute } from "next";

const baseUrl = "localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: `${baseUrl}`,
  };
}
