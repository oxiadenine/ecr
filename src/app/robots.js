import { env } from "bun";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/"
    },
    sitemap: `${env.URL}/sitemap.xml`
  };
}
