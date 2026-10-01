import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://paultechstores.com.ng";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin/", "/account/", "/cart/", "/checkout/", "/login/", "/register/", "/forgot-password/", "/reset-password/", "/order-success/", "/api/"]
		},
		sitemap: `${siteUrl}/sitemap.xml`
	};
}
