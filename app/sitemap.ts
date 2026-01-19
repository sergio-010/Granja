import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Obtener todos los productos activos
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...productUrls,
  ];
}
