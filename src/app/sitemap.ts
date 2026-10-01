import type { MetadataRoute } from "next";
import { db } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://paultechstores.com.ng";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await db.product.findMany({ select: { slug: true, updatedAt: true } });
	const staticPages: MetadataRoute.Sitemap = [
		{ url: siteUrl, changeFrequency: "weekly", priority: 1 },
		{ url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
		{ url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 }
	];

	return [
		...staticPages,
		...products.map(product => ({
			url: `${siteUrl}/products/${product.slug}`,
			lastModified: product.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.8
		}))
	];
}
