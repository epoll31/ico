import { MetadataRoute } from "next";
import path from "path";
import fs from "fs";

const rootDir = path.join(process.cwd(), "src/app");
const baseUrl = "localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  function readDirectory(dir: string, pathname: string) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        readDirectory(filePath, `${pathname}/${file}`);
      } else if (file.endsWith("page.tsx")) {
        urls.push({
          url: `${baseUrl}${pathname}`,
          lastModified: new Date().toISOString(),
          priority: 1,
          changeFrequency: "daily",
        });
      }
    });
  }
  readDirectory(rootDir, "");
  return urls;
}
