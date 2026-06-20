// app/sitemap.ts
import type { MetadataRoute } from "next";

export const revalidate = 3600; // regenerate sitemap every 1 hour

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://appshelves.com";

const API_BASE =
  process.env.NEXT_PUBLIC_API_LINK?.replace(/\/$/, "") || "";

type PublicUser = {
  username?: string;
  slug?: string;
  updatedAt?: string;
};

async function getPublicUsers(): Promise<PublicUser[]> {
  if (!API_BASE) return [];

  try {
    // Change this endpoint based on your backend route
    const res = await fetch(`${API_BASE}/public/users`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();

    // Supports both: { users: [...] } and direct [...]
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;

    return [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const publicUsers = await getPublicUsers();

  const userRoutes: MetadataRoute.Sitemap = publicUsers
    .map((user) => {
      const username = user.username || user.slug;

      if (!username) return null;

      return {
        url: `${SITE_URL}/u/${username}`,
        lastModified: user.updatedAt ? new Date(user.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...userRoutes];
}