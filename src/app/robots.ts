import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/admin/",
        "/dashboard/organizer/",
        "/dashboard/vendor/",
      ],
    },
    sitemap: "https://www.thinkthrough.in/sitemap.xml",
  };
}
