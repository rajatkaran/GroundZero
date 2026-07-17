import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.thinkthrough.in";

  // Static routes
  const staticRoutes = [
    "",
    "/auth",
    "/discover",
    "/design-system",
    "/agreement",
    "/contracts",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic routes from DB
  let dynamicRoutes: any[] = [];
  try {
    const festivals = await prisma.festival.findMany({
      select: { id: true, createdAt: true },
    });
    dynamicRoutes = festivals.map((fest) => ({
      url: `${baseUrl}/festival/${fest.id}`,
      lastModified: fest.createdAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Error generating sitemap dynamic routes", e);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
