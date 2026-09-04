import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/prisma";

export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  const q = params.q;
  const products = await db.product.findMany({
    where: {
      ...(q ? { OR: [{ name: { contains: q } }, { brand: { contains: q } }] } : {}),
      ...(category ? { category: { slug: category } } : {})
    },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
  return <section className="container py-12"><div className="mb-8"><p className="font-semibold text-blue-600">PAULTECH STORE</p><h1 className="text-4xl font-black">{category ? category.replaceAll("-", " ") : "All products"}</h1></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div>{products.length === 0 && <p>No products found.</p>}</section>;
}
