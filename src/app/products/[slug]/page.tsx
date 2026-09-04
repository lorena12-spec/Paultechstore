import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) notFound();
  return <ProductDetail product={product}/>;
}
